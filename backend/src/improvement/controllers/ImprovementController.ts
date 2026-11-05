import { Body, Controller, Get, HttpCode, Param, Patch, Post } from "@nestjs/common";
import { PromptRuleUpdateDto } from "../dto/PromptRuleUpdateDto";
import type { PromptRuleListResponse } from "../responses/PromptRuleListResponse";
import type { PromptRuleResponse } from "../responses/PromptRuleResponse";
import type { PromptSuggestionListResponse } from "../responses/PromptSuggestionListResponse";
import type { PromptSuggestionResponse } from "../responses/PromptSuggestionResponse";
import { PromptRuleService } from "../services/PromptRuleService";
import { SuggestionDecisionService } from "../services/SuggestionDecisionService";
import { SuggestionService } from "../services/SuggestionService";

@Controller("agent-quality")
export class ImprovementController {
  constructor(
    private readonly suggestionService: SuggestionService,
    private readonly suggestionDecisionService: SuggestionDecisionService,
    private readonly promptRuleService: PromptRuleService,
  ) {}

  @Get("suggestions")
  listSuggestions(): Promise<PromptSuggestionListResponse> {
    return this.suggestionService.list();
  }

  @Post("suggestions")
  suggest(): Promise<PromptSuggestionResponse> {
    return this.suggestionService.suggest();
  }

  @Post("suggestions/:id/approve")
  @HttpCode(200)
  approve(@Param("id") id: string): Promise<PromptSuggestionResponse> {
    return this.suggestionDecisionService.approve(id);
  }

  @Post("suggestions/:id/reject")
  @HttpCode(200)
  reject(@Param("id") id: string): Promise<PromptSuggestionResponse> {
    return this.suggestionDecisionService.reject(id);
  }

  @Get("rules")
  listRules(): Promise<PromptRuleListResponse> {
    return this.promptRuleService.list();
  }

  @Patch("rules/:id")
  updateRule(@Param("id") id: string, @Body() changes: PromptRuleUpdateDto): Promise<PromptRuleResponse> {
    return this.promptRuleService.setEnabled(id, changes.isEnabled);
  }
}
