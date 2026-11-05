import { Injectable } from "@nestjs/common";
import { ActivityLog } from "../../activity/services/ActivityLog";
import { AssistantSyncService } from "../../assistant/services/AssistantSyncService";
import { ActivityAction, ActivityItemType } from "../../generated/prisma/client";
import { ReviewTestRepository } from "../../review-tests/repositories/ReviewTestRepository";
import { ImprovementPresenter } from "../presenters/ImprovementPresenter";
import { PromptRuleRepository } from "../repositories/PromptRuleRepository";
import type { FeedbackItemResponse } from "../responses/FeedbackItemResponse";
import type { PromptRuleListResponse } from "../responses/PromptRuleListResponse";
import type { PromptRuleResponse } from "../responses/PromptRuleResponse";

@Injectable()
export class PromptRuleService {
  private readonly feedbackLimit = 20;

  constructor(
    private readonly promptRuleRepository: PromptRuleRepository,
    private readonly reviewTestRepository: ReviewTestRepository,
    private readonly assistantSyncService: AssistantSyncService,
    private readonly improvementPresenter: ImprovementPresenter,
    private readonly activityLog: ActivityLog,
  ) {}

  async list(): Promise<PromptRuleListResponse> {
    const rules = await this.promptRuleRepository.findAll();
    return { rules: rules.map((rule) => this.improvementPresenter.toRule(rule)) };
  }

  async setEnabled(id: string, isEnabled: boolean): Promise<PromptRuleResponse> {
    const rule = await this.promptRuleRepository.setEnabled(id, isEnabled);
    await this.assistantSyncService.syncAgent();
    await this.activityLog.record({ action: ActivityAction.promptRuleToggled, itemType: ActivityItemType.promptRule, itemId: id });
    return this.improvementPresenter.toRule(rule);
  }

  listEnabledTexts(): Promise<string[]> {
    return this.promptRuleRepository.findEnabledTexts();
  }

  async listFeedback(): Promise<FeedbackItemResponse[]> {
    const tests = await this.reviewTestRepository.findNotPassing(this.feedbackLimit);
    return tests.map((test) => ({ reviewCallId: test.reviewCallId ?? "", callerLine: test.callerLine, reason: test.verdictReason, expectation: test.expectation }));
  }
}
