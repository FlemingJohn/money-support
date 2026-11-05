import { TestGaugeSvg } from "@/agent-quality/TestGaugeSvg";
import { formatShortDateTime } from "@/lib/formatShortDateTime";
import type { LastRunCardProps } from "@/types/LastRunCardProps";

export function LastRunCard({ run }: LastRunCardProps) {
  if (!run) return null;
  const notPassed = run.results.filter((result) => result.status !== "passed");
  const seconds = Math.round((new Date(run.finishedAt).getTime() - new Date(run.startedAt).getTime()) / 1000);

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-card border border-line-soft bg-surface p-4">
      <TestGaugeSvg passedCount={run.passedCount} totalCount={run.totalCount} label="Last run" />
      <div className="flex min-w-0 flex-[1_1_240px] flex-col gap-1 text-sm">
        <span className="text-[13px] text-ink-muted">
          Last run · {formatShortDateTime(run.finishedAt)} · {Math.floor(seconds / 60)}m {seconds % 60}s
        </span>
        <strong>{notPassed.length === 0 ? "Every test passed" : `${notPassed.length} test${notPassed.length === 1 ? "" : "s"} did not pass`}</strong>
        {notPassed.slice(0, 5).map((result) => (
          <span key={result.caseId} className="text-ink-muted wrap-anywhere">
            <span className="font-mono font-semibold text-ink">{result.caseId}</span> {result.name}
          </span>
        ))}
      </div>
    </div>
  );
}
