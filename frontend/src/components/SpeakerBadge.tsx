import { AudioLines, UserRound } from "lucide-react";
import type { SpeakerBadgeProps } from "@/types/SpeakerBadgeProps";

export function SpeakerBadge({ speaker, time }: SpeakerBadgeProps) {
  const isAgent = speaker === "agent";
  const Icon = isAgent ? AudioLines : UserRound;

  return (
    <span className="flex flex-col items-center gap-1 text-center text-xs font-bold text-ink-muted">
      <span className={`grid size-7.5 place-items-center rounded-full ${isAgent ? "bg-yellow text-ink" : "bg-redacted-wash text-redacted-ink"}`}>
        <Icon size={16} strokeWidth={2} aria-hidden="true" />
      </span>
      <span>{isAgent ? "Agent" : "Caller"}</span>
      <span className="font-mono font-medium">{time}</span>
    </span>
  );
}
