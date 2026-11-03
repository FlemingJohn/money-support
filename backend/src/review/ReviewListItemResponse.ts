import type { ReviewReason, ReviewStatus } from "../generated/prisma/client";

export interface ReviewListItemResponse {
  callId: string;
  topic: string;
  reason: ReviewReason;
  status: ReviewStatus;
  hasRemovedData: boolean;
  isPhoneCall: boolean;
  startedAt: string | null;
}
