import type { AgentSync } from "@/types/AgentSync";
import type { FaqDraft } from "@/types/FaqDraft";
import type { SavingState } from "@/types/SavingState";

export interface FaqEditor {
  draft: FaqDraft;
  agentSync: AgentSync | null;
  savingState: SavingState;
  errorMessage: string;
  isValid: boolean;
  changeDraft: (changes: Partial<FaqDraft>) => void;
  save: () => Promise<void>;
  remove: () => Promise<void>;
}
