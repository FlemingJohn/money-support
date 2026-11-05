import { ProgressBarSvg } from "@/agent-quality/ProgressBarSvg";
import { StepStatusIcon } from "@/agent-quality/StepStatusIcon";
import type { SuggestionStreamProps } from "@/types/SuggestionStreamProps";

export function SuggestionStream({ state }: SuggestionStreamProps) {
  return (
    <ol aria-live="polite" className="flex flex-col gap-3 rounded-card border border-line-soft bg-surface p-4">
      {state.steps.map((step) => (
        <li key={step.key} className="grid grid-cols-[22px_minmax(0,1fr)] items-start gap-3">
          <StepStatusIcon status={step.status} />
          <div className="flex min-w-0 flex-col gap-1.5">
            <span className={`text-sm font-semibold ${step.status === "waiting" ? "text-ink-muted" : "text-ink"}`}>{step.label}</span>
            {step.key === "rule" && step.detail && <span className="rounded-control border border-line-soft bg-paper px-3 py-2 text-sm wrap-anywhere">+ {step.detail}</span>}
            {step.key !== "rule" && step.detail && <span className="text-[13px] text-ink-muted">{step.detail}</span>}
            {step.key === "tests" && step.status === "active" && (
              <div className="flex items-center gap-3">
                <ProgressBarSvg done={state.testsDone} total={state.testsTotal} label="Tests finished" />
                <span className="shrink-0 font-mono text-[13px] text-ink-muted">
                  {state.testsDone} / {state.testsTotal || "…"}
                </span>
              </div>
            )}
          </div>
        </li>
      ))}
      {state.message && <li className="text-sm text-handoff-ink">{state.message}</li>}
    </ol>
  );
}
