import type { PromptSuggestionStatus } from "@/types/PromptSuggestionStatus";

export const suggestionStatusLabels: Record<PromptSuggestionStatus, string> = {
  testing: "Testing",
  pending: "Waiting for you",
  approved: "Approved",
  rejected: "Rejected",
  discarded: "Discarded: did not improve the tests",
};
