"use client";

import { useBackendChange } from "@/hooks/useBackendChange";
import type { ReviewFormProps } from "@/types/ReviewFormProps";

export function ReviewStatusButtons({ review }: ReviewFormProps) {
  const { savingState, errorMessage, send } = useBackendChange();
  const reviewPath = `/reviews/${encodeURIComponent(review.callId)}`;
  const isSaving = savingState === "saving";

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      {errorMessage && <span role="alert" className="text-xs text-handoff-ink">{errorMessage}</span>}
      {review.status === "open" && (
        <button type="button" onClick={() => send("PATCH", reviewPath, { status: "inProgress" })} disabled={isSaving} className="min-h-11 rounded-control border border-line px-4 text-sm font-semibold hover:bg-surface disabled:opacity-50">
          Mark in progress
        </button>
      )}
      {review.status !== "done" ? (
        <button type="button" onClick={() => send("PATCH", reviewPath, { status: "done" })} disabled={isSaving} className="min-h-11 rounded-control bg-ink px-4 text-sm font-semibold text-paper hover:bg-ink-muted disabled:opacity-50">
          Resolve
        </button>
      ) : (
        <button type="button" onClick={() => send("PATCH", reviewPath, { status: "open" })} disabled={isSaving} className="min-h-11 rounded-control border border-line px-4 text-sm font-semibold hover:bg-surface disabled:opacity-50">
          Reopen
        </button>
      )}
    </div>
  );
}
