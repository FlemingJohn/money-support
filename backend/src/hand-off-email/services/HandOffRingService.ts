import { Injectable, Logger } from "@nestjs/common";
import { AppConfiguration } from "../../configuration/services/AppConfiguration";
import { SettingsService } from "../../settings/services/SettingsService";
import { TeamPhoneRinger } from "../clients/TeamPhoneRinger";
import type { HandOffRingDto } from "../dto/HandOffRingDto";
import type { HandOffRingResponse } from "../responses/HandOffRingResponse";
import { TeamAlertSpeechBuilder } from "./TeamAlertSpeechBuilder";

@Injectable()
export class HandOffRingService {
  private readonly logger = new Logger(HandOffRingService.name);

  constructor(
    private readonly appConfiguration: AppConfiguration,
    private readonly settingsService: SettingsService,
    private readonly teamPhoneRinger: TeamPhoneRinger,
    private readonly teamAlertSpeechBuilder: TeamAlertSpeechBuilder,
  ) {}

  async ringTeam(request: HandOffRingDto): Promise<HandOffRingResponse> {
    const phone = await this.settingsService.getPhone();
    if (!this.appConfiguration.isTwilioConfigured || !phone.mobilePhone) return { isRung: false };
    try {
      await this.teamPhoneRinger.ring(phone.mobilePhone, this.teamAlertSpeechBuilder.makeDuringCall(request.reason, request.callerNeed));
      this.logger.log(`Rang the team phone during call ${request.callId}`);
      return { isRung: true };
    } catch (error) {
      this.logger.error(`Ringing the team phone during call ${request.callId} failed: ${error instanceof Error ? error.message : String(error)}`);
      return { isRung: false };
    }
  }
}
