import type { ReviewTestCheck, ReviewTestResult, VerdictReason } from "../../generated/prisma/client";

export interface ReviewTestResponse {
  id: string;
  label: string;
  callerLine: string;
  check: ReviewTestCheck;
  expectation: string;
  verdictReason: VerdictReason;
  isEnabled: boolean;
  lastResult: ReviewTestResult;
  lastRunAt: string | null;
  reviewCallId: string | null;
  createdAt: string;
}
