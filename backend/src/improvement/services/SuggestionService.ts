import { Injectable } from "@nestjs/common";
import type { Response } from "express";
import { ActivityLog } from "../../activity/services/ActivityLog";
import { AiEventStream } from "../../common/services/AiEventStream";
import { EventStreamWriter } from "../../common/services/EventStreamWriter";
import type { StreamEvent } from "../../common/types/StreamEvent";
import { ActivityAction, ActivityItemType } from "../../generated/prisma/client";
import { AiImprovementClient } from "../clients/AiImprovementClient";
import { NothingToLearnException } from "../exceptions/NothingToLearnException";
import { ImprovementPresenter } from "../presenters/ImprovementPresenter";
import { PromptSuggestionRepository } from "../repositories/PromptSuggestionRepository";
import type { PromptSuggestionListResponse } from "../responses/PromptSuggestionListResponse";
import type { PromptSuggestionResponse } from "../responses/PromptSuggestionResponse";
import type { SuggestionResult } from "../types/SuggestionResult";

@Injectable()
export class SuggestionService {
  constructor(
    private readonly promptSuggestionRepository: PromptSuggestionRepository,
    private readonly aiImprovementClient: AiImprovementClient,
    private readonly improvementPresenter: ImprovementPresenter,
    private readonly activityLog: ActivityLog,
    private readonly aiEventStream: AiEventStream,
    private readonly eventStreamWriter: EventStreamWriter,
  ) {}

  async list(): Promise<PromptSuggestionListResponse> {
    const suggestions = await this.promptSuggestionRepository.findRecent();
    return { suggestions: suggestions.map((suggestion) => this.improvementPresenter.toSuggestion(suggestion)) };
  }

  async suggest(): Promise<PromptSuggestionResponse> {
    const testing = await this.promptSuggestionRepository.startTesting();
    const result = await this.aiImprovementClient.suggest().catch(async (error: unknown) => {
      await this.promptSuggestionRepository.delete(testing.id);
      throw error;
    });
    if (!result) {
      await this.promptSuggestionRepository.delete(testing.id);
      throw new NothingToLearnException();
    }
    return this.saveResult(testing.id, result);
  }

  async streamSuggest(response: Response): Promise<void> {
    const testing = await this.promptSuggestionRepository.startTesting();
    this.eventStreamWriter.start(response);
    let isSaved = false;
    try {
      for await (const event of this.aiEventStream.open("/improvements/suggest/stream")) {
        isSaved = (await this.relay(response, testing.id, event)) || isSaved;
      }
    } catch (error) {
      this.eventStreamWriter.send(response, { type: "error", message: `The suggestion could not be made: ${String(error)}` });
    }
    if (!isSaved) await this.promptSuggestionRepository.delete(testing.id);
    this.eventStreamWriter.end(response);
  }

  private async relay(response: Response, testingId: string, event: StreamEvent): Promise<boolean> {
    if (event.type === "result") {
      this.eventStreamWriter.send(response, { type: "saved", suggestion: await this.saveResult(testingId, event.suggestion as SuggestionResult) });
      return true;
    }
    this.eventStreamWriter.send(response, event.type === "nothing" ? { type: "nothing", message: new NothingToLearnException().message } : event);
    return false;
  }

  private async saveResult(testingId: string, result: SuggestionResult): Promise<PromptSuggestionResponse> {
    const suggestion = await this.promptSuggestionRepository.finishTesting(testingId, result);
    await this.activityLog.record({ action: ActivityAction.suggestionCreated, itemType: ActivityItemType.suggestion, itemId: suggestion.id });
    return this.improvementPresenter.toSuggestion(suggestion);
  }
}
