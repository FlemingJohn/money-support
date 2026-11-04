import type { ReviewReason } from "@/types/ReviewReason";

export interface ReviewListItem {
  callId: string;
  topic: string;
  reason: ReviewReason;
  hasRemovedData: boolean;
  startedAt: string | null;
}
