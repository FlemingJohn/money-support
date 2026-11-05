import type { ReviewTestCheck, VerdictReason } from "../../generated/prisma/client";

export interface ReviewTestDraft {
  callerLine: string;
  check: ReviewTestCheck;
  expectation: string;
  verdictReason: VerdictReason;
}
