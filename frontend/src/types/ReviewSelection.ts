import type { ReviewStatus } from "@/types/ReviewStatus";

export interface ReviewSelection {
  status: ReviewStatus;
  callId: string | null;
}
