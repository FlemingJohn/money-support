import type { ReviewReason } from "../../generated/prisma/client";
import type { RedactedLine } from "../../guardrails/types/RedactedLine";
import type { ReportedField } from "./ReportedField";

export interface CallAnalysis {
  lines: RedactedLine[];
  summary: string | null;
  topic: string | null;
  matchedFaqNumber: number | null;
  isHandedOff: boolean;
  fields: ReportedField[];
  suggestedReviewReason: ReviewReason | null;
  isComplete: boolean;
}
