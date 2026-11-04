import { Injectable } from "@nestjs/common";
import { Clock } from "../../common/services/Clock";

@Injectable()
export class RequestRateLimiter {
  private readonly windowMilliseconds = 60_000;
  private readonly requestsPerWindow = 60;
  private readonly requestTimesByCaller = new Map<string, number[]>();

  constructor(private readonly clock: Clock) {}

  isAllowed(callerKey: string): boolean {
    const now = this.clock.now().getTime();
    const recent = (this.requestTimesByCaller.get(callerKey) ?? []).filter((time) => now - time < this.windowMilliseconds);
    if (recent.length >= this.requestsPerWindow) return false;
    this.requestTimesByCaller.set(callerKey, [...recent, now]);
    return true;
  }
}
