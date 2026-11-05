import { makeReviewPath } from "@/review/makeReviewPath";
import type { ReviewList } from "@/types/ReviewList";
import type { ReviewSelection } from "@/types/ReviewSelection";

export function findNextReviewPath(reviewList: ReviewList, selection: ReviewSelection, selectedCallId: string | null): string | null {
  const index = reviewList.reviews.findIndex((review) => review.callId === selectedCallId);
  const next = reviewList.reviews[index + 1] ?? reviewList.reviews.find((review) => review.callId !== selectedCallId);
  return next ? makeReviewPath({ ...selection, callId: next.callId }) : null;
}
