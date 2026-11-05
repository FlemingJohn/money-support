import { ArrowLeftRight, CircleCheck, Clock, Phone } from "lucide-react";
import { formatDuration } from "@/lib/formatDuration";
import type { CallTotals } from "@/types/CallTotals";
import type { OverviewPeriodWording } from "@/types/OverviewPeriodWording";
import type { Stat } from "@/types/Stat";

export function makeOverviewStats(current: CallTotals, previous: CallTotals, wording: OverviewPeriodWording): Stat[] {
  return [
    makeCallCountStat(current, previous, wording),
    makeResolvedStat(current),
    makeHandedOffStat(current, previous, wording),
    makeAverageLengthStat(current, previous, wording),
  ];
}

function makeCallCountStat(current: CallTotals, previous: CallTotals, wording: OverviewPeriodWording): Stat {
  const difference = current.callCount - previous.callCount;
  return {
    label: wording.callCountLabel,
    value: String(current.callCount),
    icon: Phone,
    detail: describeCountChange(difference, "call", wording.comparison),
    tone: "neutral",
    trend: difference >= 0 ? "up" : "down",
  };
}

function makeResolvedStat(current: CallTotals): Stat {
  const share = current.callCount === 0 ? 0 : Math.round((current.resolvedCount / current.callCount) * 100);
  return {
    label: "Resolved by agent",
    value: `${share}%`,
    icon: CircleCheck,
    detail: `${current.resolvedCount} of ${current.callCount} calls`,
    tone: "neutral",
    progress: share,
  };
}

function makeHandedOffStat(current: CallTotals, previous: CallTotals, wording: OverviewPeriodWording): Stat {
  const difference = current.handedOffCount - previous.handedOffCount;
  return {
    label: "Handed to a person",
    value: String(current.handedOffCount),
    icon: ArrowLeftRight,
    detail: describeCountChange(difference, "hand-off", wording.comparison),
    tone: difference <= 0 ? "good" : "neutral",
    trend: difference >= 0 ? "up" : "down",
  };
}

function makeAverageLengthStat(current: CallTotals, previous: CallTotals, wording: OverviewPeriodWording): Stat {
  return {
    label: "Average call length",
    value: formatDuration(current.averageDurationSeconds),
    icon: Clock,
    detail: describeLengthChange(current.averageDurationSeconds, previous.averageDurationSeconds, wording.comparison),
    tone: "neutral",
    trend: (current.averageDurationSeconds ?? 0) >= (previous.averageDurationSeconds ?? 0) ? "up" : "down",
    isMonospace: true,
  };
}

function describeCountChange(difference: number, noun: string, comparison: string): string {
  if (difference === 0) return `Same as ${comparison}`;
  const amount = Math.abs(difference);
  const plural = amount === 1 ? noun : `${noun}s`;
  return `${amount} ${plural} ${difference > 0 ? "more" : "fewer"} than ${comparison}`;
}

function describeLengthChange(currentSeconds: number | null, previousSeconds: number | null, comparison: string): string {
  if (currentSeconds === null || previousSeconds === null) return "No calls to compare";
  const difference = Math.round(currentSeconds - previousSeconds);
  if (difference === 0) return `Same as ${comparison}`;
  return `${Math.abs(difference)} s ${difference > 0 ? "longer" : "shorter"} than ${comparison}`;
}
