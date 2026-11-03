import { Injectable } from "@nestjs/common";
import { Clock } from "../../common/services/Clock";
import type { TimeWindow } from "../types/TimeWindow";

@Injectable()
export class DayRange {
  constructor(private readonly clock: Clock) {}

  today(): TimeWindow {
    return this.dayStartingAt(this.startOfDay(this.clock.now()));
  }

  yesterday(): TimeWindow {
    const todayStart = this.startOfDay(this.clock.now());
    return this.dayStartingAt(new Date(todayStart.getFullYear(), todayStart.getMonth(), todayStart.getDate() - 1));
  }

  private startOfDay(moment: Date): Date {
    return new Date(moment.getFullYear(), moment.getMonth(), moment.getDate());
  }

  private dayStartingAt(start: Date): TimeWindow {
    return { start, end: new Date(start.getFullYear(), start.getMonth(), start.getDate() + 1) };
  }
}
