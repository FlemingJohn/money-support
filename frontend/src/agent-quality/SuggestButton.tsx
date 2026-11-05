"use client";

import { Loader, Sparkles } from "lucide-react";
import { useBackendChange } from "@/hooks/useBackendChange";

export function SuggestButton() {
  const { savingState, errorMessage, send } = useBackendChange();
  const isWorking = savingState === "saving";

  return (
    <div className="flex flex-col gap-2">
      <button type="button" onClick={() => send("POST", "/agent-quality/suggestions")} disabled={isWorking} className="inline-flex min-h-11 items-center gap-2 self-start rounded-control bg-ink px-4 text-sm font-semibold text-paper hover:bg-ink-muted disabled:opacity-60">
        {isWorking ? <Loader size={16} strokeWidth={2} aria-hidden="true" className="animate-spin" /> : <Sparkles size={16} strokeWidth={2} aria-hidden="true" />}
        {isWorking ? "Reading the mistakes, writing a rule and testing it… a few minutes" : "Suggest an improvement"}
      </button>
      {errorMessage && <p role="alert" className="text-sm text-handoff-ink">{errorMessage}</p>}
    </div>
  );
}
