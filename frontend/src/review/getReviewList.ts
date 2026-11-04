import { getFromBackend } from "@/lib/getFromBackend";
import type { ReviewList } from "@/types/ReviewList";
import type { ReviewStatus } from "@/types/ReviewStatus";

export function getReviewList(status: ReviewStatus): Promise<ReviewList> {
  return getFromBackend<ReviewList>(`/reviews?status=${status}`);
}
