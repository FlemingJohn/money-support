import type { CallSummaryResponse } from "./CallSummaryResponse";

export interface CallPageResponse {
  calls: CallSummaryResponse[];
  page: number;
  pageSize: number;
  total: number;
}
