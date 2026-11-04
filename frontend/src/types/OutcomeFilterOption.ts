import type { CallOutcome } from "@/types/CallOutcome";

export interface OutcomeFilterOption {
  label: string;
  outcome: CallOutcome | null;
  count: number;
}
