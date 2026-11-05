import { getFromBackend } from "@/lib/getFromBackend";
import type { PromptSuggestionList } from "@/types/PromptSuggestionList";

export function getSuggestions(): Promise<PromptSuggestionList> {
  return getFromBackend<PromptSuggestionList>("/agent-quality/suggestions");
}
