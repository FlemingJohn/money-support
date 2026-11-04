import { Injectable } from "@nestjs/common";
import type { HandOffSettingsDto } from "../../settings/dto/HandOffSettingsDto";
import type { HandOffOutcome } from "../types/HandOffOutcome";
import { TeamHoursChecker } from "./TeamHoursChecker";

@Injectable()
export class HandOffOutcomeResolver {
  private readonly answeredReasons = ["assistant-forwarded-call"];
  private readonly notAnsweredReasons = ["call.forwarding.no-answer", "call.forwarding.operator-busy", "call.in-progress.error-transfer-failed"];
  private readonly callerLeftReasons = ["customer-ended-call-during-transfer", "customer-ended-call-after-warm-transfer-attempt"];

  constructor(private readonly teamHoursChecker: TeamHoursChecker) {}

  resolve(endedReason: string | null, handOff: HandOffSettingsDto, endedAt: Date): HandOffOutcome {
    const reason = endedReason ?? "";
    if (this.answeredReasons.includes(reason)) return "transferAnswered";
    if (this.notAnsweredReasons.includes(reason)) return "transferNotAnswered";
    if (this.callerLeftReasons.includes(reason)) return "callerLeftDuringTransfer";
    if (this.isOutOfHours(handOff, endedAt)) return "outOfHours";
    return "handedOff";
  }

  private isOutOfHours(handOff: HandOffSettingsDto, endedAt: Date): boolean {
    return handOff.mode === "transfer" && handOff.teamHours === "weekdays" && !this.teamHoursChecker.isOpen(endedAt);
  }
}
