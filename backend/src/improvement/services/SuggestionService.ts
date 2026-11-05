import { Injectable } from "@nestjs/common";
import { ActivityLog } from "../../activity/services/ActivityLog";
import { ActivityAction, ActivityItemType } from "../../generated/prisma/client";
import { AiImprovementClient } from "../clients/AiImprovementClient";
import { NothingToLearnException } from "../exceptions/NothingToLearnException";
import { ImprovementPresenter } from "../presenters/ImprovementPresenter";
import { PromptSuggestionRepository } from "../repositories/PromptSuggestionRepository";
import type { PromptSuggestionListResponse } from "../responses/PromptSuggestionListResponse";
import type { PromptSuggestionResponse } from "../responses/PromptSuggestionResponse";

@Injectable()
export class SuggestionService {
  constructor(
    private readonly promptSuggestionRepository: PromptSuggestionRepository,
    private readonly aiImprovementClient: AiImprovementClient,
    private readonly improvementPresenter: ImprovementPresenter,
    private readonly activityLog: ActivityLog,
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
    const suggestion = await this.promptSuggestionRepository.finishTesting(testing.id, result);
    await this.activityLog.record({ action: ActivityAction.suggestionCreated, itemType: ActivityItemType.suggestion, itemId: suggestion.id });
    return this.improvementPresenter.toSuggestion(suggestion);
  }
}
