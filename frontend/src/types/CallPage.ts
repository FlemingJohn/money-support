import type { CallSummary } from "@/types/CallSummary";

export interface CallPage {
  calls: CallSummary[];
  page: number;
  pageSize: number;
  total: number;
}
