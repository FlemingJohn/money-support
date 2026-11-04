"use client";

import { Cell, Pie, PieChart } from "recharts";
import type { OutcomeDonutChartProps } from "@/types/OutcomeDonutChartProps";

export function OutcomeDonutChart({ shares }: OutcomeDonutChartProps) {
  const total = shares.reduce((sum, share) => sum + share.count, 0);
  const description = shares.map((share) => `${share.count} ${share.label.toLowerCase()}`).join(", ");

  return (
    <div className="relative size-33 shrink-0" role="img" aria-label={`${total} calls: ${description}`}>
      <PieChart width={132} height={132}>
        <Pie data={emptyRing} dataKey="count" innerRadius={46} outerRadius={62} stroke="none" fill="var(--color-line-soft)" isAnimationActive={false} />
        <Pie data={shares} dataKey="count" nameKey="label" innerRadius={46} outerRadius={62} startAngle={90} endAngle={-270} stroke="none" isAnimationActive={false}>
          {shares.map((share) => (
            <Cell key={share.label} fill={`var(--color-${share.color})`} />
          ))}
        </Pie>
      </PieChart>
      <span className="absolute inset-0 grid place-content-center text-center">
        <span className="text-2xl font-bold tabular-nums">{total}</span>
        <span className="text-xs text-ink-muted">calls</span>
      </span>
    </div>
  );
}

const emptyRing = [{ count: 1 }];
