import { formatClockTime } from "@/lib/formatClockTime";
import { formatDuration } from "@/lib/formatDuration";
import type { Call } from "@/types/Call";
import type { CallSummary } from "@/types/CallSummary";

export function toRecentCall(summary: CallSummary): Call {
  return {
    id: summary.id,
    time: formatClockTime(summary.startedAt),
    caller: summary.callerLabel,
    channel: summary.channel,
    length: formatDuration(summary.durationSeconds),
    topic: summary.topic,
    outcome: summary.outcome,
  };
}
