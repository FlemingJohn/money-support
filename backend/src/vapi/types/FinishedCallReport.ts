import type { CallChannel } from "../../generated/prisma/client";
import type { TranscriptLine } from "../../guardrails/types/TranscriptLine";

export interface FinishedCallReport {
  callId: string;
  channel: CallChannel;
  customerNumber: string | null;
  startedAt: Date | null;
  endedAt: Date;
  endedReason: string | null;
  lines: TranscriptLine[];
  handOffReason: string | null;
}
