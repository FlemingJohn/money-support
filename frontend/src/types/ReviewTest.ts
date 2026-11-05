import type { ReviewTestResult } from "@/types/ReviewTestResult";
import type { VerdictReason } from "@/types/VerdictReason";

export interface ReviewTest {
  id: string;
  label: string;
  callerLine: string;
  check: "answers" | "handsOff";
  expectation: string;
  verdictReason: VerdictReason;
  isEnabled: boolean;
  lastResult: ReviewTestResult;
  lastRunAt: string | null;
  reviewCallId: string | null;
  createdAt: string;
}
