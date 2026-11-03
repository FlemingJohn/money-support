import type { CallChannel, CallOutcome } from "../../generated/prisma/client";

export interface CallCompletion {
  callId: string;
  channel: CallChannel;
  startedAt: Date | null;
  endedAt: Date;
  endedReason: string | null;
  summary: string | null;
  topic: string | null;
  outcome: CallOutcome;
  maskedCustomerNumber: string | null;
  encryptedCustomerNumber: string | null;
  matchedFaqId: string | null;
  promptVersionId: string | null;
}
