import { HandOffOutcomeResolver } from "../../../src/hand-off-email/services/HandOffOutcomeResolver";
import { TeamHoursChecker } from "../../../src/hand-off-email/services/TeamHoursChecker";
import type { HandOffSettingsDto } from "../../../src/settings/dto/HandOffSettingsDto";

describe("HandOffOutcomeResolver", () => {
  const resolver = new HandOffOutcomeResolver(new TeamHoursChecker());
  const endCallMode = { mode: "endCall", handOffSentence: "Please contact the team.", transferNumber: "", teamHours: "weekdays", emailTeam: true, teamEmail: "team@example.com" } as HandOffSettingsDto;
  const transferMode = { ...endCallMode, mode: "transfer", transferNumber: "+447700900123" } as HandOffSettingsDto;
  const wednesdayMorning = new Date("2026-11-04T10:30:00Z");
  const saturdayMorning = new Date("2026-11-07T10:30:00Z");

  it("treats a call ended by the hand-off sentence as a hand-off", () => {
    expect(resolver.resolve("assistant-said-end-call-phrase", endCallMode, saturdayMorning)).toBe("handedOff");
  });

  it("sees an answered transfer", () => {
    expect(resolver.resolve("assistant-forwarded-call", transferMode, wednesdayMorning)).toBe("transferAnswered");
  });

  it("sees a transfer nobody answered", () => {
    expect(resolver.resolve("call.forwarding.no-answer", transferMode, wednesdayMorning)).toBe("transferNotAnswered");
    expect(resolver.resolve("call.forwarding.operator-busy", transferMode, wednesdayMorning)).toBe("transferNotAnswered");
  });

  it("sees a caller who hung up during the transfer", () => {
    expect(resolver.resolve("customer-ended-call-during-transfer", transferMode, wednesdayMorning)).toBe("callerLeftDuringTransfer");
  });

  it("sees an out-of-hours call only in transfer mode with weekday hours", () => {
    expect(resolver.resolve("assistant-ended-call", transferMode, saturdayMorning)).toBe("outOfHours");
    expect(resolver.resolve("assistant-ended-call", { ...transferMode, teamHours: "always" }, saturdayMorning)).toBe("handedOff");
  });
});
