import { Globe, Phone } from "lucide-react";
import type { CallerLabelProps } from "@/types/CallerLabelProps";

export function CallerLabel({ call }: CallerLabelProps) {
  const Icon = call.channel === "phone" ? Phone : Globe;
  const channelName = call.channel === "phone" ? "Phone" : "Web";

  return (
    <span className="flex min-w-0 items-center gap-2">
      <Icon size={16} strokeWidth={1.9} aria-label={channelName} role="img" className="shrink-0 text-ink-muted" />
      <span className="truncate font-mono text-[13px]">{call.caller}</span>
    </span>
  );
}
