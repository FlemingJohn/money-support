"use client";

import { Check } from "lucide-react";
import { useBackendChange } from "@/hooks/useBackendChange";
import type { ConfirmFieldsButtonProps } from "@/types/ConfirmFieldsButtonProps";

export function ConfirmFieldsButton({ callId, isEveryFieldConfirmed }: ConfirmFieldsButtonProps) {
  const { savingState, errorMessage, send } = useBackendChange();

  if (isEveryFieldConfirmed) {
    return (
      <span className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-success-ink">
        <Check size={16} strokeWidth={2.2} aria-hidden="true" />
        All confirmed
      </span>
    );
  }

  return (
    <span className="flex items-center gap-2">
      {errorMessage && <span role="alert" className="text-xs text-handoff-ink">{errorMessage}</span>}
      <button
        type="button"
        onClick={() => send("POST", `/reviews/${encodeURIComponent(callId)}/field-confirmations`)}
        disabled={savingState === "saving"}
        className="min-h-11 rounded-control border border-line px-3.5 text-sm font-semibold hover:bg-surface disabled:opacity-50"
      >
        Confirm all
      </button>
    </span>
  );
}
