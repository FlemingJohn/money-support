import type { CallTotals } from "@/types/CallTotals";
import type { OutcomeShare } from "@/types/OutcomeShare";

export function makeOutcomeShares(today: CallTotals): OutcomeShare[] {
  return [
    { label: "Resolved", count: today.resolvedCount, color: "yellow" },
    { label: "Handed off", count: today.handedOffCount, color: "ink" },
  ];
}
