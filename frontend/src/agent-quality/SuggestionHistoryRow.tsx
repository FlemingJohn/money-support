import { formatShortDateTime } from "@/lib/formatShortDateTime";
import { suggestionStatusLabels } from "@/lib/suggestionStatusLabels";
import type { SuggestionHistoryRowProps } from "@/types/SuggestionHistoryRowProps";

export function SuggestionHistoryRow({ suggestion }: SuggestionHistoryRowProps) {
  const isApproved = suggestion.status === "approved";

  return (
    <li className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-line-soft px-5 py-3 text-sm last:border-b-0">
      <span className="w-24 shrink-0 text-[13px] text-ink-muted">{formatShortDateTime(suggestion.createdAt)}</span>
      <span className="min-w-0 flex-[1_1_260px] wrap-anywhere">{suggestion.ruleText}</span>
      {suggestion.totalTests !== null && (
        <span className="font-mono text-[13px] text-ink-muted">
          {suggestion.passedBefore} → {suggestion.passedAfter}
        </span>
      )}
      <span className={`rounded-full px-2.5 py-0.5 text-[13px] font-semibold ${isApproved ? "bg-success-wash text-success-ink" : "bg-sand text-ink-muted"}`}>{suggestionStatusLabels[suggestion.status]}</span>
    </li>
  );
}
