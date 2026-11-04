import type { VerdictReason } from "@/types/VerdictReason";

export interface WrongVerdictDetailsProps {
  verdictReason: VerdictReason;
  expectedBehaviour: string;
  isSaving: boolean;
  onReasonChange: (verdictReason: VerdictReason) => void;
  onExpectedBehaviourChange: (expectedBehaviour: string) => void;
  onSave: () => void;
}
