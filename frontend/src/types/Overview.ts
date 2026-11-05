import type { CallSummary } from "@/types/CallSummary";
import type { CallTotals } from "@/types/CallTotals";
import type { CallVolumeCount } from "@/types/CallVolumeCount";
import type { HandOffReason } from "@/types/HandOffReason";
import type { OverviewPeriod } from "@/types/OverviewPeriod";
import type { ReviewListItem } from "@/types/ReviewListItem";

export interface Overview {
  period: OverviewPeriod;
  current: CallTotals;
  previous: CallTotals;
  callVolume: CallVolumeCount[];
  handOffReasons: HandOffReason[];
  recentCalls: CallSummary[];
  needsReview: ReviewListItem[];
}
