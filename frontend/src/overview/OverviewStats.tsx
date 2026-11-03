import { StatCard } from "@/components/StatCard";
import type { OverviewStatsProps } from "@/types/OverviewStatsProps";

export function OverviewStats({ stats }: OverviewStatsProps) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-4">
      {stats.map((stat) => (
        <StatCard key={stat.label} stat={stat} />
      ))}
    </div>
  );
}
