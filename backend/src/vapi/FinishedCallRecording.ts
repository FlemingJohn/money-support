import type { CallCompletion } from "../calls/CallCompletion";
import type { ReviewReason } from "../generated/prisma/client";
import type { FinishedCallReport } from "./FinishedCallReport";
import type { RedactedReport } from "./RedactedReport";

export interface FinishedCallRecording {
  report: FinishedCallReport;
  redactedReport: RedactedReport;
  reviewReason: ReviewReason | null;
  completion: CallCompletion;
}
