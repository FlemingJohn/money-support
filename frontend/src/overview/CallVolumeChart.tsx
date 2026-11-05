"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { NoCallsSvg } from "@/overview/NoCallsSvg";
import type { CallVolumeChartProps } from "@/types/CallVolumeChartProps";

export function CallVolumeChart({ counts, label, emptyMessage }: CallVolumeChartProps) {
  const hasCalls = counts.some((count) => count.resolved + count.handedOff > 0);

  if (!hasCalls) {
    return (
      <div className="flex h-60 w-full flex-col items-center justify-center gap-3 text-center">
        <NoCallsSvg />
        <p className="text-sm text-ink-muted">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="h-60 w-full" role="img" aria-label={`${label}, split into resolved and handed off`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={counts} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
          <CartesianGrid vertical={false} stroke="var(--color-line-soft)" />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tick={axisTick} interval="preserveStartEnd" minTickGap={8} />
          <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={axisTick} />
          <Tooltip cursor={{ fill: "var(--color-yellow-wash)" }} contentStyle={tooltipStyle} />
          <Bar dataKey="resolved" name="Resolved" stackId="calls" fill="var(--color-yellow)" maxBarSize={48} />
          <Bar dataKey="handedOff" name="Handed off" stackId="calls" fill="var(--color-ink)" radius={[3, 3, 0, 0]} maxBarSize={48} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

const axisTick = {
  fill: "var(--color-ink-muted)",
  fontSize: 11,
  fontFamily: "var(--font-mono)",
};

const tooltipStyle = {
  borderRadius: "var(--radius-control)",
  border: "1px solid var(--color-line)",
  fontSize: 13,
};
