import type { CallOutcome } from "@/types/CallOutcome";

export interface CallFilter {
  outcome: CallOutcome | null;
  search: string;
  page: number;
}
