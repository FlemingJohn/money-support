import type { ReviewReason, ReviewStatus } from "../../generated/prisma/client";

export interface CallReviewResponse {
  status: ReviewStatus;
  reason: ReviewReason;
}
