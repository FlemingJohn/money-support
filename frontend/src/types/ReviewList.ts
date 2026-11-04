import type { ReviewCounts } from "@/types/ReviewCounts";
import type { ReviewListItem } from "@/types/ReviewListItem";

export interface ReviewList {
  reviews: ReviewListItem[];
  counts: ReviewCounts;
}
