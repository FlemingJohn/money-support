"use client";

import { useState } from "react";
import { useBackendChange } from "@/hooks/useBackendChange";
import type { ReviewFormProps } from "@/types/ReviewFormProps";

export function ReviewNoteForm({ review }: ReviewFormProps) {
  const { savingState, errorMessage, send } = useBackendChange();
  const [note, setNote] = useState(review.note);
  const hasChanged = note !== review.note;

  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex flex-col gap-1.5 text-sm font-semibold">
        Note
        <textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          rows={3}
          maxLength={2000}
          placeholder="What did you do for this caller?"
          className="rounded-control border border-line bg-paper px-3 py-2 font-normal"
        />
      </label>
      <div className="flex items-center justify-end gap-3">
        {savingState === "saved" && !hasChanged && <span role="status" className="text-xs text-success-ink">Saved</span>}
        {errorMessage && <span role="alert" className="text-xs text-handoff-ink">{errorMessage}</span>}
        <button
          type="button"
          onClick={() => send("PATCH", `/reviews/${encodeURIComponent(review.callId)}`, { note })}
          disabled={!hasChanged || savingState === "saving"}
          className="min-h-11 rounded-control border border-line px-4 text-sm font-semibold hover:bg-surface disabled:opacity-40"
        >
          Save note
        </button>
      </div>
    </div>
  );
}
