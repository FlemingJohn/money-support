import type { Review } from "@/types/Review";

export interface VerdictSummaryProps {
  review: Review;
  nextReviewPath: string | null;
  onChange: () => void;
}
