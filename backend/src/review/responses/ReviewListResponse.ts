import type { ReviewCounts } from "../types/ReviewCounts";
import type { ReviewListItemResponse } from "./ReviewListItemResponse";

export interface ReviewListResponse {
  reviews: ReviewListItemResponse[];
  counts: ReviewCounts;
}
