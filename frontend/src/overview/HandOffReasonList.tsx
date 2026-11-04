import type { HandOffReasonListProps } from "@/types/HandOffReasonListProps";

export function HandOffReasonList({ reasons }: HandOffReasonListProps) {
  const largestCount = Math.max(...reasons.map((reason) => reason.count));

  return (
    <div className="flex flex-col gap-2.5">
      <h3 className="text-[13px] font-semibold text-ink-muted">Top hand-off reasons</h3>
      {reasons.length === 0 && <p className="text-sm text-ink-muted">No hand-offs today.</p>}
      <ul className="flex flex-col gap-2.5">
        {reasons.map((reason) => (
          <li key={reason.label} className="flex flex-col gap-1 text-sm">
            <span className="flex items-center gap-3">
              <span className="min-w-0 flex-1 truncate">{reason.label}</span>
              <span className="font-semibold tabular-nums">{reason.count}</span>
            </span>
            <span className="h-1.5 rounded-full bg-sand">
              <span className="block h-1.5 rounded-full bg-ink" style={{ width: `${(reason.count / largestCount) * 100}%` }} />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
