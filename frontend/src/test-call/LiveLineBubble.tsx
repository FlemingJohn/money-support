import { Loader, Mic, ShieldAlert } from "lucide-react";
import { TranscriptText } from "@/calls/TranscriptText";
import type { LiveLineBubbleProps } from "@/types/LiveLineBubbleProps";

export function LiveLineBubble({ line, masking }: LiveLineBubbleProps) {
  const notice = "flex items-center gap-2 text-ink-muted";

  if (line.speaker === "agent") return <span>{line.text}</span>;
  if (masking?.status === "failed") {
    return (
      <span className={notice}>
        <ShieldAlert size={14} strokeWidth={2} aria-hidden="true" />
        Hidden: this line couldn&apos;t be checked
      </span>
    );
  }
  const isFinalShown = masking?.status === "checked" && line.isFinal;
  if (masking?.redactedText) {
    return (
      <span className={isFinalShown ? "" : "text-ink-muted"}>
        <TranscriptText text={masking.redactedText} />
        {!isFinalShown && <Loader size={12} strokeWidth={2} aria-label="Still checking" className="ml-1.5 inline animate-spin align-middle" />}
      </span>
    );
  }
  return (
    <span className={notice}>
      {line.isFinal ? <Loader size={14} strokeWidth={2} aria-hidden="true" className="animate-spin" /> : <Mic size={14} strokeWidth={2} aria-hidden="true" className="animate-pulse" />}
      {line.isFinal ? "Checking for personal data…" : "Listening…"}
    </span>
  );
}
