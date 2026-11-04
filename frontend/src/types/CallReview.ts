import type { ReviewReason } from "@/types/ReviewReason";
import type { ReviewStatus } from "@/types/ReviewStatus";

export interface CallReview {
  status: ReviewStatus;
  reason: ReviewReason;
}
