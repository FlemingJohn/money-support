import type { CallSummaryResponse } from "../calls/responses/CallSummaryResponse";
import type { ReviewListItemResponse } from "../review/ReviewListItemResponse";
import type { CallTotals } from "./CallTotals";
import type { HandOffReasonCount } from "./HandOffReasonCount";
import type { HourlyCount } from "./HourlyCount";

export interface OverviewResponse {
  today: CallTotals;
  yesterday: CallTotals;
  callsPerHour: HourlyCount[];
  handOffReasons: HandOffReasonCount[];
  recentCalls: CallSummaryResponse[];
  needsReview: ReviewListItemResponse[];
}
