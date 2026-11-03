import { Injectable } from "@nestjs/common";
import { type Call, CallOutcome } from "../generated/prisma/client";
import type { CallTotals } from "./CallTotals";
import type { HandOffReasonCount } from "./HandOffReasonCount";
import type { HourlyCount } from "./HourlyCount";

@Injectable()
export class CallStatistics {
  private readonly reasonLimit = 4;
  private readonly otherReasonLabel = "Other";

  totals(calls: Call[]): CallTotals {
    const durations = calls.map((call) => this.durationSeconds(call)).filter((duration) => duration !== null);
    return {
      callCount: calls.length,
      resolvedCount: this.countOutcome(calls, CallOutcome.resolved),
      handedOffCount: this.countOutcome(calls, CallOutcome.handedOff),
      averageDurationSeconds: durations.length === 0 ? null : Math.round(durations.reduce((sum, duration) => sum + duration, 0) / durations.length),
    };
  }

  countByHour(calls: Call[]): HourlyCount[] {
    const hours = calls.map((call) => call.endedAt?.getHours()).filter((hour) => hour !== undefined);
    if (hours.length === 0) return [];
    const firstHour = Math.min(...hours);
    const lastHour = Math.max(...hours);
    return Array.from({ length: lastHour - firstHour + 1 }, (_, offset) => this.countHour(calls, firstHour + offset));
  }

  countHandOffReasons(calls: Call[]): HandOffReasonCount[] {
    const ranked = this.rankTopics(calls.filter((call) => call.outcome === CallOutcome.handedOff));
    const topReasons = ranked.slice(0, this.reasonLimit);
    const remainderCount = ranked.slice(this.reasonLimit).reduce((sum, reason) => sum + reason.count, 0);
    return remainderCount > 0 ? [...topReasons, { label: this.otherReasonLabel, count: remainderCount }] : topReasons;
  }

  private rankTopics(calls: Call[]): HandOffReasonCount[] {
    const counts = new Map<string, number>();
    calls.forEach((call) => {
      const label = call.topic ?? this.otherReasonLabel;
      counts.set(label, (counts.get(label) ?? 0) + 1);
    });
    return [...counts.entries()].map(([label, count]) => ({ label, count })).sort((first, second) => second.count - first.count);
  }

  private countHour(calls: Call[], hour: number): HourlyCount {
    const callsInHour = calls.filter((call) => call.endedAt?.getHours() === hour);
    return {
      hour: String(hour).padStart(2, "0"),
      resolved: this.countOutcome(callsInHour, CallOutcome.resolved),
      handedOff: this.countOutcome(callsInHour, CallOutcome.handedOff),
    };
  }

  private countOutcome(calls: Call[], outcome: CallOutcome): number {
    return calls.filter((call) => call.outcome === outcome).length;
  }

  private durationSeconds(call: Call): number | null {
    if (!call.startedAt || !call.endedAt) return null;
    return Math.round((call.endedAt.getTime() - call.startedAt.getTime()) / 1000);
  }
}
