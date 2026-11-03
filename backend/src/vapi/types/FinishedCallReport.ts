import type { CallChannel } from "../../generated/prisma/client";
import type { TranscriptLine } from "../../guardrails/types/TranscriptLine";
import type { ReportedField } from "./ReportedField";

export interface FinishedCallReport {
  callId: string;
  channel: CallChannel;
  customerNumber: string | null;
  startedAt: Date | null;
  endedAt: Date;
  endedReason: string | null;
  summary: string | null;
  topic: string | null;
  matchedFaqNumber: number | null;
  isHandedOff: boolean;
  lines: TranscriptLine[];
  fields: ReportedField[];
}
