"use client";

import { CloudOff } from "lucide-react";
import { IconTile } from "@/components/IconTile";
import type { DashboardErrorProps } from "@/types/DashboardErrorProps";

export default function DashboardError({ reset }: DashboardErrorProps) {
  return (
    <div role="alert" className="flex flex-1 flex-col items-center justify-center gap-3 rounded-card border border-line bg-paper p-10 text-center">
      <IconTile icon={CloudOff} className="bg-handoff-wash text-handoff-ink" />
      <h2 className="text-base font-bold">This page couldn&apos;t load</h2>
      <p className="max-w-sm text-sm text-ink-muted">The backend didn&apos;t answer. Check that it is running, then try again.</p>
      <button
        type="button"
        onClick={reset}
        className="min-h-11 rounded-control bg-ink px-4 text-sm font-semibold text-paper hover:bg-ink-muted"
      >
        Try again
      </button>
    </div>
  );
}
