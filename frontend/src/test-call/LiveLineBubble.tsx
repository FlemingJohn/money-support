import { Loader, Mic, ShieldAlert } from "lucide-react";
import { TranscriptText } from "@/calls/TranscriptText";
import type { LiveLineBubbleProps } from "@/types/LiveLineBubbleProps";

export function LiveLineBubble({ line, masking }: LiveLineBubbleProps) {
  const notice = "flex items-center gap-2 text-ink-muted";

  if (line.speaker === "agent") return <span>{line.text}</span>;
  if (!line.isFinal) {
    return (
      <span className={notice}>
        <Mic size={14} strokeWidth={2} aria-hidden="true" className="animate-pulse" />
        Listening…
      </span>
    );
  }
  if (!masking || masking.status === "checking") {
    return (
      <span className={notice}>
        <Loader size={14} strokeWidth={2} aria-hidden="true" className="animate-spin" />
        Checking for personal data…
      </span>
    );
  }
  if (masking.status === "failed") {
    return (
      <span className={notice}>
        <ShieldAlert size={14} strokeWidth={2} aria-hidden="true" />
        Hidden: this line couldn&apos;t be checked
      </span>
    );
  }
  return <TranscriptText text={masking.redactedText} />;
}
