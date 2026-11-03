import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { StatDetailProps } from "@/types/StatDetailProps";

export function StatTrend({ stat }: StatDetailProps) {
  const TrendIcon = stat.trend === "up" ? ArrowUpRight : ArrowDownRight;
  const color = stat.tone === "good" ? "text-success-ink" : "text-ink-muted";

  return (
    <p className={`inline-flex items-center gap-1 whitespace-nowrap text-[13px] font-semibold ${color}`}>
      <TrendIcon size={16} strokeWidth={2} aria-hidden="true" />
      {stat.detail}
    </p>
  );
}
