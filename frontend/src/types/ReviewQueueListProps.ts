import type { ReviewListItem } from "@/types/ReviewListItem";
import type { ReviewSelection } from "@/types/ReviewSelection";

export interface ReviewQueueListProps {
  reviews: ReviewListItem[];
  selection: ReviewSelection;
  selectedCallId: string | null;
}
