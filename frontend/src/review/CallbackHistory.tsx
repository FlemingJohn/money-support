import { PhoneCall, PhoneOff } from "lucide-react";
import { formatClockTime } from "@/lib/formatClockTime";
import { formatDuration } from "@/lib/formatDuration";
import type { CallbackHistoryProps } from "@/types/CallbackHistoryProps";

export function CallbackHistory({ callbacks }: CallbackHistoryProps) {
  if (callbacks.length === 0) return null;

  return (
    <ul className="flex flex-col gap-2">
      {callbacks.map((callback) => {
        const isFailed = callback.status === "failed";
        const Icon = isFailed ? PhoneOff : PhoneCall;
        return (
          <li key={callback.id} className="flex items-center gap-2.5 rounded-control bg-surface px-3 py-2 text-sm">
            <Icon size={16} strokeWidth={1.9} aria-hidden="true" className={isFailed ? "text-handoff-ink" : "text-success-ink"} />
            <span>
              {isFailed ? "Call back did not connect at " : "Called back at "}
              <span className="font-mono">{formatClockTime(callback.startedAt)}</span>
              {!isFailed && callback.durationSeconds !== null && (
                <>
                  {" "}· talked for <span className="font-mono">{formatDuration(callback.durationSeconds)}</span>
                </>
              )}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
