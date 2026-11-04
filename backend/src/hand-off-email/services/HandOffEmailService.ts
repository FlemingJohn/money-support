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
import type { HandOffEmailInput } from "../types/HandOffEmailInput";
import type { HandOffOutcome } from "../types/HandOffOutcome";
import { HandOffEmailBuilder } from "./HandOffEmailBuilder";
import { HandOffOutcomeResolver } from "./HandOffOutcomeResolver";

@Injectable()
export class HandOffEmailService {
  private readonly logger = new Logger(HandOffEmailService.name);

  constructor(
    private readonly appConfiguration: AppConfiguration,
    private readonly settingsService: SettingsService,
    private readonly reviewRepository: ReviewRepository,
    private readonly activityLog: ActivityLog,
    private readonly clock: Clock,
    private readonly handOffOutcomeResolver: HandOffOutcomeResolver,
    private readonly handOffEmailBuilder: HandOffEmailBuilder,
    private readonly handOffMailer: HandOffMailer,
  ) {}

  async sendIfHandedOff(recording: FinishedCallRecording): Promise<void> {
    if (!recording.analysis.isHandedOff || !this.appConfiguration.isMailConfigured) return;
    const handOff = await this.settingsService.getHandOff();
    if (!handOff.emailTeam || !handOff.teamEmail) return;
    const outcome = this.handOffOutcomeResolver.resolve(recording.report.endedReason, handOff, recording.report.endedAt);
    if (outcome === "transferAnswered") return;
    const callId = recording.report.callId;
    if (!(await this.reviewRepository.claimHandOffEmail(callId, this.clock.now()))) return;
    await this.sendClaimedEmail(recording, handOff, outcome);
  }

  private async sendClaimedEmail(recording: FinishedCallRecording, handOff: HandOffSettingsDto, outcome: HandOffOutcome): Promise<void> {
    const callId = recording.report.callId;
    try {
      await this.handOffMailer.send(this.handOffEmailBuilder.build(this.makeInput(recording, handOff, outcome)));
      await this.activityLog.record({ action: ActivityAction.handOffEmailSent, itemType: ActivityItemType.review, itemId: callId });
    } catch (error) {
      this.logger.error(`Hand-off email for call ${callId} failed: ${error instanceof Error ? error.message : String(error)}`);
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
}
