import { Injectable } from "@nestjs/common";
import { CallRepository } from "../calls/CallRepository";
import { Clock } from "../common/Clock";
import { ReviewTriage } from "../review/ReviewTriage";
import type { TriageFacts } from "../review/TriageFacts";
import { CallCompletionBuilder } from "./CallCompletionBuilder";
import type { FinishedCallReport } from "./FinishedCallReport";
import { FinishedCallWriter } from "./FinishedCallWriter";
import type { RedactedReport } from "./RedactedReport";
import { ReportRedactor } from "./ReportRedactor";
import { VapiCallArchive } from "./VapiCallArchive";
import type { VapiMessage } from "./VapiMessage";
import { VapiReportReader } from "./VapiReportReader";

@Injectable()
export class CallRecordingService {
  private readonly startedStatus = "in-progress";

  constructor(
    private readonly clock: Clock,
    private readonly callRepository: CallRepository,
    private readonly vapiReportReader: VapiReportReader,
    private readonly reportRedactor: ReportRedactor,
    private readonly reviewTriage: ReviewTriage,
    private readonly callCompletionBuilder: CallCompletionBuilder,
    private readonly finishedCallWriter: FinishedCallWriter,
    private readonly vapiCallArchive: VapiCallArchive,
  ) {}

  async recordCallStart(message: VapiMessage): Promise<void> {
    if (message.status !== this.startedStatus) return;
    const callId = this.vapiReportReader.readCallId(message);
    await this.callRepository.recordStarted(callId, this.vapiReportReader.readChannel(message), this.clock.now());
  }

  async recordFinishedCall(message: VapiMessage): Promise<void> {
    const report = this.vapiReportReader.read(message);
    const redactedReport = await this.reportRedactor.redact(report);
    const reviewReason = this.reviewTriage.decideReason(this.triageFacts(report, redactedReport));
    const completion = await this.callCompletionBuilder.build(report, redactedReport, reviewReason !== null);
    await this.finishedCallWriter.write({ report, redactedReport, reviewReason, completion });
    await this.vapiCallArchive.removeIfEnabled(report.callId);
  }

  private triageFacts(report: FinishedCallReport, redactedReport: RedactedReport): TriageFacts {
    return {
      isHandedOff: report.isHandedOff,
      removedEntityCount: redactedReport.lines.reduce((count, line) => count + line.removedEntityTypes.length, 0),
      fieldConfidences: report.fields.map((field) => field.confidence),
    };
  }
}
