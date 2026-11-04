import type { RedactedLine } from "../../guardrails/types/RedactedLine";
import type { HandOffOutcome } from "./HandOffOutcome";

export interface HandOffEmailInput {
  to: string;
  outcome: HandOffOutcome;
  callId: string;
  startedAt: Date | null;
  endedAt: Date;
  maskedCustomerNumber: string | null;
  topic: string | null;
  summary: string | null;
  lines: RedactedLine[];
  transferNumber: string;
  callUrl: string;
}
