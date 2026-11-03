"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { CallsPerHourChartProps } from "@/types/CallsPerHourChartProps";

export function CallsPerHourChart({ counts }: CallsPerHourChartProps) {
  return (
    <div className="h-60 w-full" role="img" aria-label="Calls per hour, split into resolved and handed off">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={counts} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
          <CartesianGrid vertical={false} stroke="var(--color-line-soft)" />
          <XAxis dataKey="hour" tickLine={false} axisLine={false} tick={axisTick} />
          <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={axisTick} />
          <Tooltip cursor={{ fill: "var(--color-yellow-wash)" }} contentStyle={tooltipStyle} />
          <Bar dataKey="resolved" name="Resolved" stackId="calls" fill="var(--color-yellow)" />
          <Bar dataKey="handedOff" name="Handed off" stackId="calls" fill="var(--color-ink)" radius={[3, 3, 0, 0]} />
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
