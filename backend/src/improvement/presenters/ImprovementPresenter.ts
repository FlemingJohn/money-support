import { Injectable } from "@nestjs/common";
import type { PromptRule } from "../../generated/prisma/client";
import type { PromptRuleResponse } from "../responses/PromptRuleResponse";
import type { PromptSuggestionResponse } from "../responses/PromptSuggestionResponse";
import type { PromptSuggestionWithReviews } from "../types/PromptSuggestionWithReviews";

@Injectable()
export class ImprovementPresenter {
  toSuggestion(suggestion: PromptSuggestionWithReviews): PromptSuggestionResponse {
    return {
      id: suggestion.id,
      ruleText: suggestion.ruleText,
      explanation: suggestion.explanation,
      status: suggestion.status,
      passedBefore: suggestion.passedBefore,
      passedAfter: suggestion.passedAfter,
      totalTests: suggestion.totalTests,
      reviewCount: suggestion.reviews.length,
      createdAt: suggestion.createdAt.toISOString(),
      decidedAt: suggestion.decidedAt?.toISOString() ?? null,
    };
  }

  toRule(rule: PromptRule): PromptRuleResponse {
    return { id: rule.id, ruleText: rule.ruleText, isEnabled: rule.isEnabled, addedInVersionId: rule.addedInVersionId, createdAt: rule.createdAt.toISOString() };
  }
}
