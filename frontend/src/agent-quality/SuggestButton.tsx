"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { applySuggestionEvent } from "@/agent-quality/applySuggestionEvent";
import { makeSuggestionSteps } from "@/agent-quality/makeSuggestionSteps";
import { SuggestionStream } from "@/agent-quality/SuggestionStream";
import { streamFromBackend } from "@/lib/streamFromBackend";
import type { SuggestionStreamState } from "@/types/SuggestionStreamState";

export function SuggestButton() {
  const router = useRouter();
  const [isWorking, setIsWorking] = useState(false);
  const [state, setState] = useState<SuggestionStreamState | null>(null);

  async function suggest() {
    setIsWorking(true);
    setState(makeSuggestionSteps());
    await streamFromBackend("/agent-quality/suggestions/stream", (event) => setState((current) => applySuggestionEvent(current ?? makeSuggestionSteps(), event))).catch((error: unknown) =>
      setState((current) => applySuggestionEvent(current ?? makeSuggestionSteps(), { type: "error", message: String(error) })),
    );
    setIsWorking(false);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-3">
      <button type="button" onClick={suggest} disabled={isWorking} className="inline-flex min-h-11 items-center gap-2 self-start rounded-control bg-ink px-4 text-sm font-semibold text-paper hover:bg-ink-muted disabled:opacity-60">
        <Sparkles size={16} strokeWidth={2} aria-hidden="true" />
        {isWorking ? "Working…" : "Suggest an improvement"}
      </button>
      {state && (isWorking || state.message) && <SuggestionStream state={state} />}
    </div>
  );
}
