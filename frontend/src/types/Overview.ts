import type { CallSummary } from "@/types/CallSummary";
import type { CallTotals } from "@/types/CallTotals";
import type { HandOffReason } from "@/types/HandOffReason";
import type { HourlyCallCount } from "@/types/HourlyCallCount";
import type { ReviewListItem } from "@/types/ReviewListItem";

export interface Overview {
  today: CallTotals;
  yesterday: CallTotals;
  callsPerHour: HourlyCallCount[];
  handOffReasons: HandOffReason[];
  recentCalls: CallSummary[];
  needsReview: ReviewListItem[];
}
