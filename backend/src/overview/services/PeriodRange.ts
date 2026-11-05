import { Injectable } from "@nestjs/common";
import { Clock } from "../../common/services/Clock";
import type { OverviewPeriod } from "../types/OverviewPeriod";
import type { TimeWindow } from "../types/TimeWindow";
import { periodDayCounts } from "./periodDayCounts";
import { UkTime } from "./UkTime";

@Injectable()
export class PeriodRange {
  constructor(
    private readonly clock: Clock,
    private readonly ukTime: UkTime,
  ) {}

  current(period: OverviewPeriod): TimeWindow {
    const end = this.ukTime.addDays(this.ukTime.startOfDay(this.clock.now()), 1);
    return { start: this.ukTime.addDays(end, -periodDayCounts[period]), end };
  }

  previous(period: OverviewPeriod): TimeWindow {
    const current = this.current(period);
    return { start: this.ukTime.addDays(current.start, -periodDayCounts[period]), end: current.start };
  }

  getDayStarts(period: OverviewPeriod): Date[] {
    const start = this.current(period).start;
    return Array.from({ length: periodDayCounts[period] }, (_, offset) => this.ukTime.addDays(start, offset));
  }
}
