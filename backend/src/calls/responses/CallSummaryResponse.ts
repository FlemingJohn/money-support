import type { CallChannel, CallOutcome, CallStatus } from "../../generated/prisma/client";

export interface CallSummaryResponse {
  id: string;
  channel: CallChannel;
  status: CallStatus;
  callerLabel: string;
  startedAt: string | null;
  durationSeconds: number | null;
  topic: string;
  outcome: CallOutcome | null;
}
