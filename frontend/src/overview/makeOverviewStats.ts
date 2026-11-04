import { ArrowLeftRight, CircleCheck, Clock, Phone } from "lucide-react";
import { formatDuration } from "@/lib/formatDuration";
import type { CallTotals } from "@/types/CallTotals";
import type { Stat } from "@/types/Stat";

export function makeOverviewStats(today: CallTotals, yesterday: CallTotals): Stat[] {
  return [
    makeCallCountStat(today, yesterday),
    makeResolvedStat(today),
    makeHandedOffStat(today, yesterday),
    makeAverageLengthStat(today, yesterday),
  ];
}

function makeCallCountStat(today: CallTotals, yesterday: CallTotals): Stat {
  const difference = today.callCount - yesterday.callCount;
  return {
    label: "Calls today",
    value: String(today.callCount),
    icon: Phone,
    detail: describeCountChange(difference, "call"),
    tone: "neutral",
    trend: difference >= 0 ? "up" : "down",
  };
}

function makeResolvedStat(today: CallTotals): Stat {
  const share = today.callCount === 0 ? 0 : Math.round((today.resolvedCount / today.callCount) * 100);
  return {
    label: "Resolved by agent",
    value: `${share}%`,
    icon: CircleCheck,
    detail: `${today.resolvedCount} of ${today.callCount} calls`,
    tone: "neutral",
    progress: share,
  };
}

function makeHandedOffStat(today: CallTotals, yesterday: CallTotals): Stat {
  const difference = today.handedOffCount - yesterday.handedOffCount;
  return {
    label: "Handed to a person",
    value: String(today.handedOffCount),
    icon: ArrowLeftRight,
    detail: describeCountChange(difference, "hand-off"),
    tone: difference <= 0 ? "good" : "neutral",
    trend: difference >= 0 ? "up" : "down",
  };
}

function makeAverageLengthStat(today: CallTotals, yesterday: CallTotals): Stat {
  return {
    label: "Average call length",
    value: formatDuration(today.averageDurationSeconds),
    icon: Clock,
    detail: describeLengthChange(today.averageDurationSeconds, yesterday.averageDurationSeconds),
    tone: "neutral",
    trend: (today.averageDurationSeconds ?? 0) >= (yesterday.averageDurationSeconds ?? 0) ? "up" : "down",
    isMonospace: true,
  };
}

function describeCountChange(difference: number, noun: string): string {
  if (difference === 0) return "Same as yesterday";
  const amount = Math.abs(difference);
  const plural = amount === 1 ? noun : `${noun}s`;
  return `${amount} ${plural} ${difference > 0 ? "more" : "fewer"} than yesterday`;
}

function describeLengthChange(todaySeconds: number | null, yesterdaySeconds: number | null): string {
  if (todaySeconds === null || yesterdaySeconds === null) return "No calls to compare";
  const difference = Math.round(todaySeconds - yesterdaySeconds);
  if (difference === 0) return "Same as yesterday";
  return `${Math.abs(difference)} s ${difference > 0 ? "longer" : "shorter"} than yesterday`;
}
