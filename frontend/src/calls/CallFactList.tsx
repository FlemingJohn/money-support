import { describeEndedReason } from "@/calls/describeEndedReason";
import { formatClockTime } from "@/lib/formatClockTime";
import type { CallDetailProps } from "@/types/CallDetailProps";

export function CallFactList({ call }: CallDetailProps) {
  const facts = [
    { label: "Call ID", value: call.id, isMonospace: true },
    { label: "Started", value: formatClockTime(call.startedAt), isMonospace: true },
    { label: "Channel", value: call.channel === "phone" ? "Phone" : "Web" },
    { label: "Ended by", value: describeEndedReason(call.endedReason) },
    { label: "Review", value: call.review ? `In the queue (${call.review.status === "done" ? "done" : "open"})` : "Not needed" },
    { label: "Prompt", value: call.promptVersionId ? call.promptVersionId.slice(0, 8) : "—", isMonospace: true },
  ];

  return (
    <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-2.5 px-5 py-4 text-sm">
      {facts.map((fact) => (
        <div key={fact.label} className="contents">
          <dt className="text-ink-muted">{fact.label}</dt>
          <dd className={`wrap-anywhere ${fact.isMonospace ? "font-mono text-[13px]" : ""}`}>{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
}
