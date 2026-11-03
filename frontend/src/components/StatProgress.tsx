import type { StatDetailProps } from "@/types/StatDetailProps";

export function StatProgress({ stat }: StatDetailProps) {
  return (
    <div className="flex w-full max-w-45 flex-col items-center gap-1">
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-sand">
        <div className="h-1.5 bg-yellow" style={{ width: `${stat.progress}%` }} />
      </div>
      <span className="whitespace-nowrap text-[13px] text-ink-muted tabular-nums">{stat.detail}</span>
    </div>
  );
}
