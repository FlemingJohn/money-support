import { EmptyTestsSvg } from "@/agent-quality/EmptyTestsSvg";
import { ReviewTestRow } from "@/agent-quality/ReviewTestRow";
import { RunTestsButton } from "@/agent-quality/RunTestsButton";
import type { ReviewTestsPanelProps } from "@/types/ReviewTestsPanelProps";

export function ReviewTestsPanel({ tests }: ReviewTestsPanelProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 px-5 pt-5">
        <p className="text-sm text-ink-muted">Every reply a reviewer marks wrong becomes a test here. Running the tests checks the 25 built-in cases and these against the real agent.</p>
        <RunTestsButton />
      </div>
      {tests.length === 0 ? (
        <div className="flex flex-col items-center gap-3 px-5 pb-8 pt-4 text-center text-sm text-ink-muted">
          <EmptyTestsSvg />
          <p>No tests from reviews yet. Mark a reply wrong on the Review page and it appears here.</p>
        </div>
      ) : (
        <ul aria-label="Tests from reviews" className="border-t border-line-soft">
          {tests.map((test) => (
            <ReviewTestRow key={test.id} test={test} />
          ))}
        </ul>
      )}
    </div>
  );
}
