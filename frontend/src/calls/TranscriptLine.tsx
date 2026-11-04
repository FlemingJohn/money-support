import { ShieldCheck } from "lucide-react";
import { ReportLineButton } from "@/calls/ReportLineButton";
import { splitTranscriptText } from "@/calls/splitTranscriptText";
import { SpeakerBadge } from "@/components/SpeakerBadge";
import { formatDuration } from "@/lib/formatDuration";
import type { TranscriptLineProps } from "@/types/TranscriptLineProps";

export function TranscriptLine({ callId, message, fields }: TranscriptLineProps) {
  const isAgent = message.speaker === "agent";
  const parts = splitTranscriptText(message.text, fields);

  return (
    <li className="grid grid-cols-[72px_minmax(0,1fr)] items-start gap-3">
      <SpeakerBadge speaker={message.speaker} time={formatDuration(message.secondsFromStart)} />
      <div className="flex min-w-0 flex-col items-start gap-0.5">
        <p className={`w-full rounded-card border px-3.5 py-2.5 text-sm leading-relaxed wrap-anywhere ${isAgent ? "border-line-soft bg-surface" : "border-yellow-soft bg-yellow-wash"}`}>
          {parts.map((part, index) => {
            if (part.kind === "field") {
              return (
                <mark key={index} className="rounded-sm bg-yellow-soft px-1 text-ink box-decoration-clone">
                  {part.text}
                  <sup className="ml-0.5 font-mono text-[10px] font-bold">{part.fieldNumber}</sup>
                </mark>
              );
            }
            if (part.kind === "removed") {
              return (
                <span key={index} className="inline-flex items-center gap-1 whitespace-nowrap rounded-sm bg-redacted-wash px-2 text-[13px] font-semibold text-redacted-ink">
                  <ShieldCheck size={12} strokeWidth={2.2} aria-hidden="true" />
                  {part.text}
                </span>
              );
            }
            return <span key={index}>{part.text}</span>;
          })}
        </p>
        <ReportLineButton callId={callId} messageId={message.id} />
      </div>
    </li>
  );
}
