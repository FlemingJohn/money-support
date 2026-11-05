import type { TranscriptLine } from "../../guardrails/types/TranscriptLine";
import type { FaqQuestion } from "./FaqQuestion";

export interface CallAnalysisInput {
  callId: string;
  lines: TranscriptLine[];
  endedReason: string | null;
  maskKinds: string[];
  faqs: FaqQuestion[];
  handOffSentence: string;
  callerNumber: string;
  maskLines: boolean;
}
