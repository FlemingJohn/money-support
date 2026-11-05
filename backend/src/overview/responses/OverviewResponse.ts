import type { CallSummaryResponse } from "../../calls/responses/CallSummaryResponse";
import type { ReviewListItemResponse } from "../../review/responses/ReviewListItemResponse";
import type { OverviewPeriod } from "../types/OverviewPeriod";
import type { CallTotals } from "./CallTotals";
import type { CallVolumeCount } from "./CallVolumeCount";
import type { HandOffReasonCount } from "./HandOffReasonCount";

export interface OverviewResponse {
  period: OverviewPeriod;
  current: CallTotals;
  previous: CallTotals;
  callVolume: CallVolumeCount[];
  handOffReasons: HandOffReasonCount[];
  recentCalls: CallSummaryResponse[];
  needsReview: ReviewListItemResponse[];
}
