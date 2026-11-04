import type { CallCompletion } from "../../calls/types/CallCompletion";
import type { ReviewReason } from "../../generated/prisma/client";
import type { CallAnalysis } from "./CallAnalysis";
import type { FinishedCallReport } from "./FinishedCallReport";

export interface FinishedCallRecording {
  report: FinishedCallReport;
  analysis: CallAnalysis;
  reviewReason: ReviewReason | null;
  completion: CallCompletion;
}
