import type { CallMessage } from "@/types/CallMessage";
import type { VerdictReason } from "@/types/VerdictReason";

export interface WrongVerdictDetailsProps {
  verdictReason: VerdictReason;
  agentReplies: CallMessage[];
  verdictMessageId: string;
  onReplyChange: (verdictMessageId: string) => void;
  expectedBehaviour: string;
  isSaving: boolean;
  onReasonChange: (verdictReason: VerdictReason) => void;
  onExpectedBehaviourChange: (expectedBehaviour: string) => void;
  onSave: () => void;
}
