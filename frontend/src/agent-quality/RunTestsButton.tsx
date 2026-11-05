"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Play } from "lucide-react";
import { TestRunProgress } from "@/agent-quality/TestRunProgress";
import { streamFromBackend } from "@/lib/streamFromBackend";
import type { StreamEvent } from "@/types/StreamEvent";
import type { TestRunCaseResult } from "@/types/TestRunCaseResult";

export function RunTestsButton() {
  const router = useRouter();
  const [isRunning, setIsRunning] = useState(false);
  const [total, setTotal] = useState(0);
  const [results, setResults] = useState<TestRunCaseResult[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  function handleEvent(event: StreamEvent) {
    if (event.type === "started") setTotal(Number(event.total));
    if (event.type === "result") setResults((current) => [...current, event.result as TestRunCaseResult]);
    if (event.type === "error") setErrorMessage(String(event.message));
  }

  async function run() {
    setIsRunning(true);
    setResults([]);
    setTotal(0);
    setErrorMessage("");
    await streamFromBackend("/agent-quality/tests/run/stream", handleEvent).catch((error: unknown) => setErrorMessage(String(error)));
    setIsRunning(false);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-3">
      <button type="button" onClick={run} disabled={isRunning} className="inline-flex min-h-11 items-center gap-2 self-start rounded-control bg-ink px-4 text-sm font-semibold text-paper hover:bg-ink-muted disabled:opacity-60">
        <Play size={16} strokeWidth={2} aria-hidden="true" />
        {isRunning ? "Running…" : "Run all tests"}
      </button>
      {isRunning && <TestRunProgress total={total} results={results} />}
      {errorMessage && <p role="alert" className="text-sm text-handoff-ink">{errorMessage}</p>}
    </div>
  );
}
