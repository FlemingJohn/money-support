import { EmptyTestsSvg } from "@/agent-quality/EmptyTestsSvg";
import { LastRunCard } from "@/agent-quality/LastRunCard";
import { ReviewTestTable } from "@/agent-quality/ReviewTestTable";
import { RunTestsButton } from "@/agent-quality/RunTestsButton";
import type { ReviewTestsPanelProps } from "@/types/ReviewTestsPanelProps";

export function ReviewTestsPanel({ tests, lastRun }: ReviewTestsPanelProps) {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-3 p-5">
        <RunTestsButton />
        <LastRunCard run={lastRun} />
      </div>
      {tests.length === 0 ? (
        <div className="flex flex-col items-center gap-3 border-t border-line-soft px-5 py-8 text-center text-sm text-ink-muted">
          <EmptyTestsSvg />
          <p>No tests from reviews yet.</p>
        </div>
      ) : (
        <ReviewTestTable tests={tests} />
      )}
    </div>
  );
}
