"use client";

import { Check, X } from "lucide-react";
import { TestGaugeSvg } from "@/agent-quality/TestGaugeSvg";
import { useBackendChange } from "@/hooks/useBackendChange";
import { formatShortDateTime } from "@/lib/formatShortDateTime";
import { suggestionStatusLabels } from "@/lib/suggestionStatusLabels";
import type { SuggestionCardProps } from "@/types/SuggestionCardProps";

export function SuggestionCard({ suggestion }: SuggestionCardProps) {
  const { savingState, errorMessage, send } = useBackendChange();
  const isPending = suggestion.status === "pending";
  const totalTests = suggestion.totalTests ?? 0;
  const basePath = `/agent-quality/suggestions/${suggestion.id}`;

  return (
    <article className={`flex flex-col gap-3 rounded-card border p-4 ${isPending ? "border-yellow-deep bg-yellow-wash" : "border-line-soft bg-paper"}`}>
      <div className="flex flex-wrap items-center justify-between gap-2 text-[13px] text-ink-muted">
        <span className="rounded-full bg-sand px-2.5 py-0.5 font-semibold text-ink">{suggestionStatusLabels[suggestion.status]}</span>
        <span>
          {formatShortDateTime(suggestion.createdAt)} · from {suggestion.reviewCount} review{suggestion.reviewCount === 1 ? "" : "s"}
        </span>
      </div>
      <p className="rounded-control border border-line-soft bg-paper px-3 py-2 text-sm font-semibold">+ {suggestion.ruleText}</p>
      {suggestion.explanation && <p className="text-sm text-ink-muted">{suggestion.explanation}</p>}
      {suggestion.totalTests !== null && (
        <div className="flex items-center gap-3">
          <TestGaugeSvg passedCount={suggestion.passedBefore ?? 0} totalCount={totalTests} label="Before the rule" />
          <span aria-hidden="true" className="text-xl text-ink-muted">→</span>
          <TestGaugeSvg passedCount={suggestion.passedAfter ?? 0} totalCount={totalTests} label="With the rule" />
        </div>
      )}
      {isPending && (
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => send("POST", `${basePath}/approve`)} disabled={savingState === "saving"} className="inline-flex min-h-11 items-center gap-2 rounded-control bg-ink px-4 text-sm font-semibold text-paper hover:bg-ink-muted disabled:opacity-60">
            <Check size={16} strokeWidth={2} aria-hidden="true" />
            Approve and update the agent
          </button>
          <button type="button" onClick={() => send("POST", `${basePath}/reject`)} disabled={savingState === "saving"} className="inline-flex min-h-11 items-center gap-2 rounded-control border border-line px-4 text-sm font-semibold hover:bg-surface disabled:opacity-60">
            <X size={16} strokeWidth={2} aria-hidden="true" />
            Reject
          </button>
        </div>
      )}
      {errorMessage && <p role="alert" className="text-sm text-handoff-ink">{errorMessage}</p>}
    </article>
  );
}
