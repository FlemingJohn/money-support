import { partialCheckMilliseconds } from "@/lib/liveMaskingTimings";
import type { LineCheckProgress } from "@/types/LineCheckProgress";
import type { LiveLine } from "@/types/LiveLine";

export function isLineCheckDue(line: LiveLine, progress: LineCheckProgress, now: number): boolean {
  if (progress.isInFlight || !line.text.trim()) return false;
  if (line.isFinal) return progress.finalSentText !== line.text;
  const waitedSince = Math.max(progress.firstSeenAt, progress.lastSentAt);
  return line.text !== progress.lastSentText && now - waitedSince >= partialCheckMilliseconds;
}
