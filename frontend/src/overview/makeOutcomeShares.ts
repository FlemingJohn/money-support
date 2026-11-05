import type { CallTotals } from "@/types/CallTotals";
import type { OutcomeShare } from "@/types/OutcomeShare";

export function makeOutcomeShares(totals: CallTotals): OutcomeShare[] {
  return [
    { label: "Resolved", count: totals.resolvedCount, color: "yellow" },
    { label: "Handed off", count: totals.handedOffCount, color: "ink" },
  ];
}
