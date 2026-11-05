import { getFromBackend } from "@/lib/getFromBackend";
import type { PromptRuleList } from "@/types/PromptRuleList";

export function getPromptRules(): Promise<PromptRuleList> {
  return getFromBackend<PromptRuleList>("/agent-quality/rules");
}
