import type { ReviewReason } from "@/types/ReviewReason";

export interface ReviewPreview {
  id: string;
  topic: string;
  reason: ReviewReason;
  time: string;
}
