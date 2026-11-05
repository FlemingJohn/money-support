import { Controller, Get, UseGuards } from "@nestjs/common";
import { ServiceSecretGuard } from "../../common/guards/ServiceSecretGuard";
import type { FeedbackItemResponse } from "../responses/FeedbackItemResponse";
import { PromptRuleService } from "../services/PromptRuleService";

@Controller("internal")
@UseGuards(ServiceSecretGuard)
export class InternalImprovementController {
  constructor(private readonly promptRuleService: PromptRuleService) {}

  @Get("prompt-rules")
  listEnabledRules(): Promise<string[]> {
    return this.promptRuleService.listEnabledTexts();
  }

  @Get("feedback")
  listFeedback(): Promise<FeedbackItemResponse[]> {
    return this.promptRuleService.listFeedback();
  }
}
