"use client";

import { useState } from "react";
import { Loader, Play } from "lucide-react";
import { TestRunSummary } from "@/agent-quality/TestRunSummary";
import { useBackendChange } from "@/hooks/useBackendChange";
import type { TestRunReport } from "@/types/TestRunReport";

export function RunTestsButton() {
  const { savingState, errorMessage, send } = useBackendChange();
  const [report, setReport] = useState<TestRunReport | null>(null);
  const isRunning = savingState === "saving";

  async function run() {
    setReport(await send<TestRunReport>("POST", "/agent-quality/tests/run"));
  }

  return (
    <div className="flex flex-col gap-3">
      <button type="button" onClick={run} disabled={isRunning} className="inline-flex min-h-11 items-center gap-2 self-start rounded-control bg-ink px-4 text-sm font-semibold text-paper hover:bg-ink-muted disabled:opacity-60">
        {isRunning ? <Loader size={16} strokeWidth={2} aria-hidden="true" className="animate-spin" /> : <Play size={16} strokeWidth={2} aria-hidden="true" />}
        {isRunning ? "Running every test against the agent… about two minutes" : "Run all tests"}
      </button>
      {report && <TestRunSummary report={report} />}
      {errorMessage && <p role="alert" className="text-sm text-handoff-ink">{errorMessage}</p>}
    </div>
  );
}
