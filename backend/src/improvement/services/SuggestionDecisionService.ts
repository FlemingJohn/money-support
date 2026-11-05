import { Injectable } from "@nestjs/common";
import { ActivityLog } from "../../activity/services/ActivityLog";
import { AssistantSyncService } from "../../assistant/services/AssistantSyncService";
import { Clock } from "../../common/services/Clock";
import { ActivityAction, ActivityItemType, PromptSuggestionStatus } from "../../generated/prisma/client";
import { PrismaService } from "../../prisma/services/PrismaService";
import { SuggestionNotPendingException } from "../exceptions/SuggestionNotPendingException";
import { ImprovementPresenter } from "../presenters/ImprovementPresenter";
import { PromptRuleRepository } from "../repositories/PromptRuleRepository";
import { PromptSuggestionRepository } from "../repositories/PromptSuggestionRepository";
import type { PromptSuggestionResponse } from "../responses/PromptSuggestionResponse";

@Injectable()
export class SuggestionDecisionService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly promptSuggestionRepository: PromptSuggestionRepository,
    private readonly promptRuleRepository: PromptRuleRepository,
    private readonly assistantSyncService: AssistantSyncService,
    private readonly improvementPresenter: ImprovementPresenter,
    private readonly activityLog: ActivityLog,
    private readonly clock: Clock,
  ) {}

  async approve(id: string): Promise<PromptSuggestionResponse> {
    const suggestion = await this.requirePending(id);
    const { approved, ruleId } = await this.prismaService.$transaction(async (transaction) => {
      const rule = await this.promptRuleRepository.create(transaction, suggestion.ruleText, id);
      return { approved: await this.promptSuggestionRepository.decide(transaction, id, PromptSuggestionStatus.approved, this.clock.now()), ruleId: rule.id };
    });
    const sync = await this.assistantSyncService.syncAgent();
    await this.promptRuleRepository.setAddedInVersion(ruleId, sync.promptVersionId);
    await this.activityLog.record({ action: ActivityAction.suggestionApproved, itemType: ActivityItemType.suggestion, itemId: id });
    return this.improvementPresenter.toSuggestion(approved);
  }

  async reject(id: string): Promise<PromptSuggestionResponse> {
    await this.requirePending(id);
    const rejected = await this.prismaService.$transaction((transaction) => this.promptSuggestionRepository.decide(transaction, id, PromptSuggestionStatus.rejected, this.clock.now()));
    await this.activityLog.record({ action: ActivityAction.suggestionRejected, itemType: ActivityItemType.suggestion, itemId: id });
    return this.improvementPresenter.toSuggestion(rejected);
  }

  private async requirePending(id: string) {
    const suggestion = await this.promptSuggestionRepository.findById(id);
    if (!suggestion || suggestion.status !== PromptSuggestionStatus.pending) throw new SuggestionNotPendingException(id);
    return suggestion;
  }
}
