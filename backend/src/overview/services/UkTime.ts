import { Injectable } from "@nestjs/common";
import type { WallClockParts } from "../types/WallClockParts";

@Injectable()
export class UkTime {
  private readonly timeZone = "Europe/London";
  private readonly hourInMilliseconds = 60 * 60 * 1000;
  private readonly partsFormat = new Intl.DateTimeFormat("en-GB", {
    timeZone: this.timeZone,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hourCycle: "h23",
  });
  private readonly dayLabelFormat = new Intl.DateTimeFormat("en-GB", { timeZone: this.timeZone, day: "numeric", month: "short" });

  startOfDay(moment: Date): Date {
    const parts = this.getParts(moment);
    const midnightAsUtc = Date.UTC(parts.year, parts.month - 1, parts.day);
    const firstGuess = new Date(midnightAsUtc - this.getOffset(moment));
    return new Date(midnightAsUtc - this.getOffset(firstGuess));
  }

  addDays(dayStart: Date, dayCount: number): Date {
    const middayOfTargetDay = dayStart.getTime() + dayCount * 24 * this.hourInMilliseconds + 12 * this.hourInMilliseconds;
    return this.startOfDay(new Date(middayOfTargetDay));
  }

  getHour(moment: Date): number {
    return this.getParts(moment).hour;
  }

  getDayKey(moment: Date): string {
    const parts = this.getParts(moment);
    return `${parts.year}-${parts.month}-${parts.day}`;
  }

  getDayLabel(moment: Date): string {
    return this.dayLabelFormat.format(moment);
  }

  private getOffset(moment: Date): number {
    const parts = this.getParts(moment);
    const wallClockAsUtc = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
    return wallClockAsUtc - Math.floor(moment.getTime() / 1000) * 1000;
  }

  private getParts(moment: Date): WallClockParts {
    const values = Object.fromEntries(this.partsFormat.formatToParts(moment).map((part) => [part.type, Number(part.value)]));
    return { year: values.year, month: values.month, day: values.day, hour: values.hour, minute: values.minute, second: values.second };
  }
}
