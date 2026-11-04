import type { CallChannel } from "@/types/CallChannel";
import type { CallOutcome } from "@/types/CallOutcome";

export interface CallSummary {
  id: string;
  channel: CallChannel;
  callerLabel: string;
  startedAt: string | null;
  durationSeconds: number | null;
  topic: string;
  outcome: CallOutcome | null;
}
