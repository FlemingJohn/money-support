export interface PromptRule {
  id: string;
  ruleText: string;
  isEnabled: boolean;
  addedInVersionId: string | null;
  createdAt: string;
}
