import type { ReviewReason } from "@/types/ReviewReason";
import type { ReviewStatus } from "@/types/ReviewStatus";
import type { ReviewVerdict } from "@/types/ReviewVerdict";
import type { VerdictReason } from "@/types/VerdictReason";

export interface Review {
  callId: string;
  status: ReviewStatus;
  reason: ReviewReason;
  note: string;
  verdict: ReviewVerdict | null;
  verdictReason: VerdictReason | null;
  expectedBehaviour: string | null;
  resolvedAt: string | null;
  handOffEmailedAt: string | null;
  reviewTestNumber: number | null;
  verdictMessageId: string | null;
}
