import { SpeakerBadge } from "@/components/SpeakerBadge";
import { formatDuration } from "@/lib/formatDuration";
import type { LiveTranscriptProps } from "@/types/LiveTranscriptProps";

export function LiveTranscript({ lines }: LiveTranscriptProps) {
  if (lines.length === 0) {
    return <p className="flex flex-1 items-center justify-center px-5 py-16 text-sm text-ink-muted">Start a call to see the transcript.</p>;
  }

  return (
    <ol aria-live="polite" className="flex flex-col gap-3 p-5">
      {lines.map((line) => (
        <li key={line.id} className="grid grid-cols-[72px_minmax(0,1fr)] items-start gap-3">
          <SpeakerBadge speaker={line.speaker} time={formatDuration(line.secondsFromStart)} />
          <p className={`rounded-card border px-3.5 py-2.5 text-sm leading-relaxed ${line.speaker === "agent" ? "border-line-soft bg-surface" : "border-yellow-soft bg-yellow-wash"} ${line.isFinal ? "" : "text-ink-muted"}`}>
            {line.text}
          </p>
        </li>
      ))}
    </ol>
  );
}
