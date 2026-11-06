import { ReportLineButton } from "@/calls/ReportLineButton";
import { TranscriptText } from "@/calls/TranscriptText";
import { SpeakerBadge } from "@/components/SpeakerBadge";
import { formatDuration } from "@/lib/formatDuration";
import type { TranscriptLineProps } from "@/types/TranscriptLineProps";

export function TranscriptLine({ callId, message, fields }: TranscriptLineProps) {
  const isAgent = message.speaker === "agent";

  return (
    <li className="grid grid-cols-[72px_minmax(0,1fr)] items-start gap-3">
      <SpeakerBadge speaker={message.speaker} time={formatDuration(message.secondsFromStart)} />
      <div className="flex min-w-0 flex-col items-start gap-0.5">
        <p className={`w-full rounded-card border px-3.5 py-2.5 text-sm leading-relaxed wrap-anywhere ${isAgent ? "border-line-soft bg-surface" : "border-yellow-soft bg-yellow-wash"}`}>
          <TranscriptText text={message.text} fields={fields} />
        </p>
        <ReportLineButton callId={callId} messageId={message.id} lineText={message.text} />
      </div>
    </li>
  );
}
