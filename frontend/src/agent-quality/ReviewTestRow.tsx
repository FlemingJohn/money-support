"use client";

import { Switch } from "@/components/Switch";
import { useBackendChange } from "@/hooks/useBackendChange";
import { TestResultIcon } from "@/agent-quality/TestResultIcon";
import { reviewTestCheckLabels } from "@/lib/reviewTestCheckLabels";
import type { ReviewTestRowProps } from "@/types/ReviewTestRowProps";

export function ReviewTestRow({ test }: ReviewTestRowProps) {
  const { savingState, send } = useBackendChange();

  return (
    <li className="flex flex-wrap items-center gap-3 border-b border-line-soft px-5 py-3 last:border-b-0">
      <span className="font-mono text-sm font-bold">{test.label}</span>
      <TestResultIcon result={test.lastResult} />
      <div className="flex min-w-0 flex-[1_1_260px] flex-col gap-0.5">
        <span className="text-sm wrap-anywhere">&ldquo;{test.callerLine}&rdquo;</span>
        <span className="text-[13px] text-ink-muted">
          {reviewTestCheckLabels[test.check]}
          {test.check === "answers" ? ` · ${test.expectation}` : ""}
        </span>
      </div>
      <Switch isOn={test.isEnabled} label={`Run ${test.label}`} isDisabled={savingState === "saving"} onToggle={() => send("PATCH", `/agent-quality/tests/${test.id}`, { isEnabled: !test.isEnabled })} />
    </li>
  );
}
