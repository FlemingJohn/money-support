import type { ReviewCounts } from "@/types/ReviewCounts";
import type { ReviewSelection } from "@/types/ReviewSelection";

export interface ReviewStatusTabsProps {
  counts: ReviewCounts;
  selection: ReviewSelection;
}
