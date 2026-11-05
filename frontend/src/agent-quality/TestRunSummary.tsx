import { TestGaugeSvg } from "@/agent-quality/TestGaugeSvg";
import type { TestRunSummaryProps } from "@/types/TestRunSummaryProps";

export function TestRunSummary({ report }: TestRunSummaryProps) {
  const notPassed = report.results.filter((result) => result.status !== "passed");

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-card border border-line-soft bg-surface p-4">
      <TestGaugeSvg passedCount={report.passedCount} totalCount={report.totalCount} label="Last run" />
      <div className="flex min-w-0 flex-[1_1_240px] flex-col gap-1 text-sm">
        <strong>{notPassed.length === 0 ? "Every test passed" : `${notPassed.length} test${notPassed.length === 1 ? "" : "s"} did not pass`}</strong>
        {notPassed.map((result) => (
          <span key={result.caseId} className="text-ink-muted wrap-anywhere">
            <span className="font-mono font-semibold text-ink">{result.caseId}</span> {result.name}
          </span>
        ))}
      </div>
    </div>
  );
}
