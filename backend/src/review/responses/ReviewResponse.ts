import type { ReviewReason, ReviewStatus, ReviewVerdict, VerdictReason } from "../../generated/prisma/client";

export interface ReviewResponse {
  callId: string;
  status: ReviewStatus;
  reason: ReviewReason;
  note: string;
  verdict: ReviewVerdict | null;
  verdictReason: VerdictReason | null;
  expectedBehaviour: string | null;
  resolvedAt: string | null;
}
