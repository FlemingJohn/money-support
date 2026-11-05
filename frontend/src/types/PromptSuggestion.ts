import type { PromptSuggestionStatus } from "@/types/PromptSuggestionStatus";

export interface PromptSuggestion {
  id: string;
  ruleText: string;
  explanation: string;
  status: PromptSuggestionStatus;
  passedBefore: number | null;
  passedAfter: number | null;
  totalTests: number | null;
  reviewCount: number;
  createdAt: string;
  decidedAt: string | null;
}
