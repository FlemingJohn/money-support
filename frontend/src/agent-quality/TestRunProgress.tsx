import { ProgressBarSvg } from "@/agent-quality/ProgressBarSvg";
import type { TestRunProgressProps } from "@/types/TestRunProgressProps";

export function TestRunProgress({ total, results }: TestRunProgressProps) {
  return (
    <div className="flex flex-col gap-2 rounded-card border border-line-soft bg-surface p-4" role="status">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold">Testing the agent</span>
        <span className="font-mono text-ink-muted">
          {results.length} / {total || "…"}
        </span>
      </div>
      <ProgressBarSvg done={results.length} total={total} label="Tests finished" />
      <svg viewBox={`0 0 ${Math.max(1, total) * 12} 10`} className="h-2.5 w-full max-w-md" aria-hidden="true" preserveAspectRatio="xMinYMid meet">
        {results.map((result, index) => (
          <circle key={result.caseId} cx={index * 12 + 5} cy="5" r="4" className={result.status === "passed" ? "fill-success" : "fill-handoff-ink"} />
        ))}
      </svg>
    </div>
  );
}
