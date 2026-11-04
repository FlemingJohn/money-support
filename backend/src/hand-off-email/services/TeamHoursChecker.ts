import { Injectable } from "@nestjs/common";

@Injectable()
export class TeamHoursChecker {
  private readonly openingHour = 9;
  private readonly closingHour = 17;
  private readonly weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  private readonly ukTime = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", weekday: "short", hour: "numeric", hourCycle: "h23" });

  isOpen(moment: Date): boolean {
    const parts = this.ukTime.formatToParts(moment);
    const weekday = parts.find((part) => part.type === "weekday")?.value ?? "";
    const hour = Number(parts.find((part) => part.type === "hour")?.value);
    return this.weekdays.includes(weekday) && hour >= this.openingHour && hour < this.closingHour;
  }
}
