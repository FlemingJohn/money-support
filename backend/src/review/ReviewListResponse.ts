import type { ReviewCounts } from "./ReviewCounts";
import type { ReviewListItemResponse } from "./ReviewListItemResponse";

export interface ReviewListResponse {
  reviews: ReviewListItemResponse[];
  counts: ReviewCounts;
}
