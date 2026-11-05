import type { AppConfiguration } from "../../../src/configuration/services/AppConfiguration";
import type { TeamPhoneRinger } from "../../../src/hand-off-email/clients/TeamPhoneRinger";
import { HandOffRingService } from "../../../src/hand-off-email/services/HandOffRingService";
import { TeamAlertSpeechBuilder } from "../../../src/hand-off-email/services/TeamAlertSpeechBuilder";
import type { SettingsService } from "../../../src/settings/services/SettingsService";

describe("HandOffRingService", () => {
  const settingsService = { getPhone: jest.fn() };
  const ringer = { ring: jest.fn() };
  const configuration = { isTwilioConfigured: true };
  const service = new HandOffRingService(configuration as unknown as AppConfiguration, settingsService as unknown as SettingsService, ringer as unknown as TeamPhoneRinger, new TeamAlertSpeechBuilder());
  const request = { callId: "call-1", reason: "asked to speak to a person", callerNeed: "money to Spain not arrived." };

  beforeEach(() => {
    jest.clearAllMocks();
    settingsService.getPhone.mockResolvedValue({ deskPhone: "", mobilePhone: "+447700900123", storedNumberRetention: "whenResolved" });
    ringer.ring.mockResolvedValue(undefined);
  });

  it("rings the team phone and says why the customer needs a person", async () => {
    expect(await service.ringTeam(request)).toEqual({ isRung: true });
    expect(ringer.ring).toHaveBeenCalledWith(
      "+447700900123",
      "Hi, this is the Wise voice agent. A customer on the line asked to speak to a person. They need help with money to Spain not arrived. The details will be in your email and on the Review page.",
    );
  });

  it("does not ring when no team phone is saved", async () => {
    settingsService.getPhone.mockResolvedValue({ deskPhone: "", mobilePhone: "", storedNumberRetention: "whenResolved" });
    expect(await service.ringTeam(request)).toEqual({ isRung: false });
    expect(ringer.ring).not.toHaveBeenCalled();
  });

  it("reports a failed ring instead of throwing", async () => {
    ringer.ring.mockRejectedValue(new Error("twilio down"));
    expect(await service.ringTeam(request)).toEqual({ isRung: false });
  });
});
