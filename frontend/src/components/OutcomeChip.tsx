import { ArrowLeftRight, Check, Loader } from "lucide-react";
import type { OutcomeChipProps } from "@/types/OutcomeChipProps";

export function OutcomeChip({ outcome }: OutcomeChipProps) {
  if (outcome === null) {
    return (
      <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-sand px-2.5 py-1 text-[13px] font-semibold text-ink-muted">
        <Loader size={14} strokeWidth={2.2} aria-hidden="true" />
        No outcome
      </span>
    );
  }

  const isResolved = outcome === "resolved";
  const Icon = isResolved ? Check : ArrowLeftRight;
  const colors = isResolved ? "bg-success-wash text-success-ink" : "bg-handoff-wash text-handoff-ink";

  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[13px] font-semibold ${colors}`}>
      <Icon size={14} strokeWidth={2.2} aria-hidden="true" />
      {isResolved ? "Resolved" : "Handed off"}
    </span>
  );
}
