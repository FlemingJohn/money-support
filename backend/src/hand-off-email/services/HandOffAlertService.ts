import { Injectable, Logger } from "@nestjs/common";
import { ActivityLog } from "../../activity/services/ActivityLog";
import { Clock } from "../../common/services/Clock";
import { AppConfiguration } from "../../configuration/services/AppConfiguration";
import { ActivityAction, ActivityItemType } from "../../generated/prisma/client";
import { ReviewRepository } from "../../review/repositories/ReviewRepository";
import type { HandOffSettingsDto } from "../../settings/dto/HandOffSettingsDto";
import { SettingsService } from "../../settings/services/SettingsService";
import type { FinishedCallRecording } from "../../vapi/types/FinishedCallRecording";
import { HandOffMailer } from "../clients/HandOffMailer";
import { TeamPhoneRinger } from "../clients/TeamPhoneRinger";
import type { HandOffEmailInput } from "../types/HandOffEmailInput";
import type { HandOffOutcome } from "../types/HandOffOutcome";
import { HandOffEmailBuilder } from "./HandOffEmailBuilder";
import { HandOffOutcomeResolver } from "./HandOffOutcomeResolver";

@Injectable()
export class HandOffAlertService {
  private readonly logger = new Logger(HandOffAlertService.name);

  constructor(
    private readonly appConfiguration: AppConfiguration,
    private readonly settingsService: SettingsService,
    private readonly reviewRepository: ReviewRepository,
    private readonly activityLog: ActivityLog,
    private readonly clock: Clock,
    private readonly handOffOutcomeResolver: HandOffOutcomeResolver,
    private readonly handOffEmailBuilder: HandOffEmailBuilder,
    private readonly handOffMailer: HandOffMailer,
    private readonly teamPhoneRinger: TeamPhoneRinger,
  ) {}

  async alertTeamIfHandedOff(recording: FinishedCallRecording): Promise<void> {
    if (!recording.analysis.isHandedOff) return;
    const [handOff, phone] = await Promise.all([this.settingsService.getHandOff(), this.settingsService.getPhone()]);
    const canEmail = this.appConfiguration.isMailConfigured && handOff.emailTeam && handOff.teamEmail.length > 0;
    const canRing = this.appConfiguration.isTwilioConfigured && phone.mobilePhone.length > 0;
    if (!canEmail && !canRing) return;
    if (!(await this.reviewRepository.claimHandOffEmail(recording.report.callId, this.clock.now()))) return;
    const outcome = this.handOffOutcomeResolver.resolve(recording.report.endedReason, handOff, recording.report.endedAt);
    if (canRing && outcome !== "transferAnswered") await this.ringTeam(recording.report.callId, phone.mobilePhone);
    if (canEmail) await this.sendEmail(recording, handOff, outcome);
  }

  private async ringTeam(callId: string, teamPhone: string): Promise<void> {
    try {
      await this.teamPhoneRinger.ring(teamPhone);
      this.logger.log(`Rang the team phone for call ${callId}`);
    } catch (error) {
      this.logger.error(`Ringing the team phone for call ${callId} failed: ${this.describe(error)}`);
    }
  }

  private async sendEmail(recording: FinishedCallRecording, handOff: HandOffSettingsDto, outcome: HandOffOutcome): Promise<void> {
    const callId = recording.report.callId;
    try {
      await this.handOffMailer.send(this.handOffEmailBuilder.build(this.makeInput(recording, handOff, outcome)));
      await this.activityLog.record({ action: ActivityAction.handOffEmailSent, itemType: ActivityItemType.review, itemId: callId });
    } catch (error) {
      this.logger.error(`Hand-off email for call ${callId} failed: ${this.describe(error)}`);
      await this.reviewRepository.releaseHandOffEmail(callId);
      await this.activityLog.record({ action: ActivityAction.handOffEmailFailed, itemType: ActivityItemType.review, itemId: callId });
    }
  }

  private makeInput(recording: FinishedCallRecording, handOff: HandOffSettingsDto, outcome: HandOffOutcome): HandOffEmailInput {
    const { report, analysis, completion } = recording;
    return {
      to: handOff.teamEmail,
      outcome,
      callId: report.callId,
      startedAt: report.startedAt,
      endedAt: report.endedAt,
      maskedCustomerNumber: completion.maskedCustomerNumber,
      topic: analysis.topic,
      summary: analysis.summary,
      lines: analysis.lines,
      transferNumber: handOff.transferNumber,
      callUrl: `${this.appConfiguration.frontendOrigin}/review?call=${report.callId}`,
    };
  }

  private describe(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
  }
}
