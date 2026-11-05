import { Injectable } from "@nestjs/common";
import { CallRepository } from "../../calls/repositories/CallRepository";
import { Clock } from "../../common/services/Clock";
import { ReviewTriage } from "../../review/services/ReviewTriage";
import { HandOffAlertService } from "../../hand-off-email/services/HandOffAlertService";
import type { TriageFacts } from "../../review/types/TriageFacts";
import { VapiCallArchive } from "../clients/VapiCallArchive";
import type { CallAnalysis } from "../types/CallAnalysis";
import type { VapiMessage } from "../types/VapiMessage";
import { CallCompletionBuilder } from "./CallCompletionBuilder";
import { FinishedCallWriter } from "./FinishedCallWriter";
import { ReportAnalyser } from "./ReportAnalyser";
import { VapiReportReader } from "./VapiReportReader";

@Injectable()
export class CallRecordingService {
  private readonly startedStatus = "in-progress";
  private readonly waitingText = "[waiting for privacy check]";

  constructor(
    private readonly clock: Clock,
    private readonly callRepository: CallRepository,
    private readonly vapiReportReader: VapiReportReader,
    private readonly reportAnalyser: ReportAnalyser,
    private readonly reviewTriage: ReviewTriage,
    private readonly callCompletionBuilder: CallCompletionBuilder,
    private readonly finishedCallWriter: FinishedCallWriter,
    private readonly vapiCallArchive: VapiCallArchive,
    private readonly handOffAlertService: HandOffAlertService,
  ) {}

  async recordCallStart(message: VapiMessage): Promise<void> {
    if (message.status !== this.startedStatus) return;
    const callId = this.vapiReportReader.readCallId(message);
    await this.callRepository.recordStarted(callId, this.vapiReportReader.readChannel(message), this.clock.now());
  }

  async recordFinishedCall(message: VapiMessage): Promise<void> {
    const report = this.vapiReportReader.read(message);
    const analysis = await this.reportAnalyser.analyse(report);
    const reviewReason = this.reviewTriage.decideReason(this.triageFacts(analysis));
    const completion = await this.callCompletionBuilder.build(report, analysis);
    const recording = { report, analysis, reviewReason, completion };
    await this.finishedCallWriter.write(recording);
    await this.handOffAlertService.alertTeamIfHandedOff(recording);
    if (analysis.isComplete) await this.vapiCallArchive.removeIfEnabled(report.callId);
  }

  private triageFacts(analysis: CallAnalysis): TriageFacts {
    return {
      isHandedOff: analysis.isHandedOff,
      removedEntityCount: analysis.lines.reduce((count, line) => count + line.removedEntityTypes.length, 0),
      uncheckedLineCount: analysis.lines.filter((line) => line.redactedText === this.waitingText).length,
      fieldConfidences: analysis.fields.map((field) => field.confidence),
      suggestedReason: analysis.suggestedReviewReason,
    };
  }
}
