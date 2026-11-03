import { IconTile } from "@/components/IconTile";
import { StatProgress } from "@/components/StatProgress";
import { StatTrend } from "@/components/StatTrend";
import type { StatCardProps } from "@/types/StatCardProps";

export function StatCard({ stat }: StatCardProps) {
  const valueFont = stat.isMonospace ? "font-mono" : "";

  return (
    <article className="flex min-w-0 flex-col items-center gap-2.5 rounded-card border border-line bg-paper p-5 text-center">
      <IconTile icon={stat.icon} />
      <h2 className="max-w-full truncate text-sm font-semibold text-ink-muted">{stat.label}</h2>
      <p className={`text-[32px] leading-tight font-bold tabular-nums ${valueFont}`}>{stat.value}</p>
      {stat.progress === undefined ? <StatTrend stat={stat} /> : <StatProgress stat={stat} />}
    </article>
  );
}
