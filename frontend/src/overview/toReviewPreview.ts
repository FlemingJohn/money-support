import { formatClockTime } from "@/lib/formatClockTime";
import type { ReviewListItem } from "@/types/ReviewListItem";
import type { ReviewPreview } from "@/types/ReviewPreview";

export function toReviewPreview(review: ReviewListItem): ReviewPreview {
  return {
    id: review.callId,
    topic: review.topic,
    reason: review.reason,
    hasRemovedData: review.hasRemovedData,
    time: formatClockTime(review.startedAt),
  };
}
