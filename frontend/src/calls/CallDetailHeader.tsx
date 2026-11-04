import Link from "next/link";
import { BookOpen, ChevronLeft, Clock, Hourglass, MessageSquare, ShieldCheck } from "lucide-react";
import { CallerLabel } from "@/components/CallerLabel";
import { FactTile } from "@/components/FactTile";
import { OutcomeChip } from "@/components/OutcomeChip";
import { formatClockTime } from "@/lib/formatClockTime";
import { formatDuration } from "@/lib/formatDuration";
import { toCallRow } from "@/calls/toCallRow";
import type { CallDetailProps } from "@/types/CallDetailProps";

export function CallDetailHeader({ call }: CallDetailProps) {
  const removedCount = call.guardrailEvents.filter((event) => event.kind === "personalDataRemoved").length;

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-3 rounded-card border border-line bg-paper px-5 py-4">
      <Link href="/calls" className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-control border border-line px-3.5 pl-2.5 text-sm font-semibold text-ink hover:bg-surface">
        <ChevronLeft size={18} strokeWidth={2} aria-hidden="true" />
        Calls
      </Link>
      <div className="flex min-w-0 flex-[1_1_320px] flex-col gap-1.5">
        <div className="flex flex-wrap items-center gap-x-3.5 gap-y-2">
          <h2 className="min-w-0 text-[22px] font-bold wrap-anywhere">{call.topic}</h2>
          <OutcomeChip outcome={call.outcome} />
        </div>
        <div className="flex flex-wrap items-center gap-x-4.5 gap-y-1.5 text-[13px] text-ink-muted">
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap font-mono">
            <Clock size={15} strokeWidth={1.9} aria-hidden="true" />
            {formatClockTime(call.startedAt)}
          </span>
          <CallerLabel call={toCallRow(call)} />
        </div>
      </div>
      <dl className="ml-auto flex flex-wrap gap-2">
        <FactTile icon={Hourglass} label="Length" value={formatDuration(call.durationSeconds)} isMonospace />
        <FactTile icon={MessageSquare} label="Messages" value={String(call.messages.length)} />
        <FactTile icon={BookOpen} label="Matched FAQ" value={call.matchedFaq ? `FAQ ${call.matchedFaq.number}` : "None"} />
        <FactTile icon={ShieldCheck} label="Guardrails" value={removedCount === 0 ? "None" : `${removedCount} removed`} />
      </dl>
    </div>
  );
}
