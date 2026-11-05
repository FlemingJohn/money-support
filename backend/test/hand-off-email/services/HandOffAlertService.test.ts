import type { ActivityLog } from "../../../src/activity/services/ActivityLog";
import type { Clock } from "../../../src/common/services/Clock";
import type { AppConfiguration } from "../../../src/configuration/services/AppConfiguration";
import { ActivityAction } from "../../../src/generated/prisma/client";
import type { HandOffMailer } from "../../../src/hand-off-email/clients/HandOffMailer";
import type { TeamPhoneRinger } from "../../../src/hand-off-email/clients/TeamPhoneRinger";
import { HandOffAlertService } from "../../../src/hand-off-email/services/HandOffAlertService";
import { HandOffEmailBuilder } from "../../../src/hand-off-email/services/HandOffEmailBuilder";
import { HandOffOutcomeResolver } from "../../../src/hand-off-email/services/HandOffOutcomeResolver";
import { TeamHoursChecker } from "../../../src/hand-off-email/services/TeamHoursChecker";
import type { ReviewRepository } from "../../../src/review/repositories/ReviewRepository";
import type { SettingsService } from "../../../src/settings/services/SettingsService";
import type { FinishedCallRecording } from "../../../src/vapi/types/FinishedCallRecording";

describe("HandOffAlertService", () => {
  const handOff = { mode: "endCall", handOffSentence: "Please contact the team.", transferNumber: "", teamHours: "weekdays", emailTeam: true, teamEmail: "team@example.com" };
  const settingsService = { getHandOff: jest.fn(), getPhone: jest.fn() };
  const reviewRepository = { claimHandOffEmail: jest.fn(), releaseHandOffEmail: jest.fn() };
  const activityLog = { record: jest.fn() };
  const mailer = { send: jest.fn() };
  const ringer = { ring: jest.fn() };
  const configuration = { isMailConfigured: true, isTwilioConfigured: true, frontendOrigin: "https://dashboard.example.com" };
  const service = new HandOffAlertService(
    configuration as unknown as AppConfiguration,
    settingsService as unknown as SettingsService,
    reviewRepository as unknown as ReviewRepository,
    activityLog as unknown as ActivityLog,
    { now: () => new Date("2026-11-04T15:30:00Z") } as Clock,
    new HandOffOutcomeResolver(new TeamHoursChecker()),
    new HandOffEmailBuilder(),
    mailer as unknown as HandOffMailer,
    ringer as unknown as TeamPhoneRinger,
  );

  beforeEach(() => {
    jest.clearAllMocks();
    settingsService.getHandOff.mockResolvedValue(handOff);
    settingsService.getPhone.mockResolvedValue({ deskPhone: "", mobilePhone: "+447700900123", storedNumberRetention: "whenResolved" });
    ringer.ring.mockResolvedValue(undefined);
    reviewRepository.claimHandOffEmail.mockResolvedValue(true);
    mailer.send.mockResolvedValue(undefined);
  });

  it("emails the team once for a handed-off call", async () => {
    await service.alertTeamIfHandedOff(makeRecording(true, "assistant-said-end-call-phrase"));
    expect(mailer.send).toHaveBeenCalledTimes(1);
    expect(mailer.send.mock.calls[0][0].to).toBe("team@example.com");
    expect(activityLog.record).toHaveBeenCalledWith(expect.objectContaining({ action: ActivityAction.handOffEmailSent }));
  });

  it("does not email a call the agent answered itself", async () => {
    await service.alertTeamIfHandedOff(makeRecording(false, "customer-ended-call"));
    expect(mailer.send).not.toHaveBeenCalled();
    expect(ringer.ring).not.toHaveBeenCalled();
  });

  it("emails a record of an answered transfer", async () => {
    await service.alertTeamIfHandedOff(makeRecording(true, "assistant-forwarded-call"));
    expect(mailer.send.mock.calls[0][0].subject).toMatch(/^Transferred to you: /);
  });

  it("does not email again when the same report arrives twice", async () => {
    reviewRepository.claimHandOffEmail.mockResolvedValue(false);
    await service.alertTeamIfHandedOff(makeRecording(true, "assistant-said-end-call-phrase"));
    expect(mailer.send).not.toHaveBeenCalled();
  });

  it("rings the team phone and emails for a handed-off call", async () => {
    await service.alertTeamIfHandedOff(makeRecording(true, "assistant-said-end-call-phrase"));
    expect(ringer.ring).toHaveBeenCalledWith("+447700900123");
    expect(mailer.send).toHaveBeenCalledTimes(1);
  });

  it("does not ring for a transfer someone already answered", async () => {
    await service.alertTeamIfHandedOff(makeRecording(true, "assistant-forwarded-call"));
    expect(ringer.ring).not.toHaveBeenCalled();
  });

  it("still rings when emails are off", async () => {
    settingsService.getHandOff.mockResolvedValue({ ...handOff, emailTeam: false });
    await service.alertTeamIfHandedOff(makeRecording(true, "assistant-said-end-call-phrase"));
    expect(ringer.ring).toHaveBeenCalledTimes(1);
    expect(mailer.send).not.toHaveBeenCalled();
  });

  it("does nothing when there is no team phone and emails are off", async () => {
    settingsService.getHandOff.mockResolvedValue({ ...handOff, emailTeam: false });
    settingsService.getPhone.mockResolvedValue({ deskPhone: "", mobilePhone: "", storedNumberRetention: "whenResolved" });
    await service.alertTeamIfHandedOff(makeRecording(true, "assistant-said-end-call-phrase"));
    expect(reviewRepository.claimHandOffEmail).not.toHaveBeenCalled();
  });

  it("still emails when ringing fails", async () => {
    ringer.ring.mockRejectedValue(new Error("twilio down"));
    await service.alertTeamIfHandedOff(makeRecording(true, "assistant-said-end-call-phrase"));
    expect(mailer.send).toHaveBeenCalledTimes(1);
  });

  it("releases the claim and logs a failure without throwing when sending fails", async () => {
    mailer.send.mockRejectedValue(new Error("smtp down"));
    await expect(service.alertTeamIfHandedOff(makeRecording(true, "assistant-said-end-call-phrase"))).resolves.toBeUndefined();
    expect(reviewRepository.releaseHandOffEmail).toHaveBeenCalledWith("call-1");
    expect(activityLog.record).toHaveBeenCalledWith(expect.objectContaining({ action: ActivityAction.handOffEmailFailed }));
  });
});

function makeRecording(isHandedOff: boolean, endedReason: string): FinishedCallRecording {
  return {
    report: { callId: "call-1", channel: "phone", customerNumber: null, startedAt: new Date("2026-11-04T15:23:52Z"), endedAt: new Date("2026-11-04T15:25:09Z"), endedReason, lines: [] },
    analysis: { lines: [], summary: "Summary.", topic: "Topic", matchedFaqNumber: null, isHandedOff, fields: [], suggestedReviewReason: null, isComplete: true },
    reviewReason: isHandedOff ? "handOff" : null,
    completion: { maskedCustomerNumber: "+91 ••••• ••363" },
  } as unknown as FinishedCallRecording;
}
