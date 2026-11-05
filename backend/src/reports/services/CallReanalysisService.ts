import { Injectable, Logger } from "@nestjs/common";
import { ActivityLog } from "../../activity/services/ActivityLog";
import { CallRepository } from "../../calls/repositories/CallRepository";
import { ExtractedFieldRepository } from "../../calls/repositories/ExtractedFieldRepository";
import type { CallWithDetails } from "../../calls/types/CallWithDetails";
import { Clock } from "../../common/services/Clock";
import { FaqRepository } from "../../faqs/repositories/FaqRepository";
import { ActivityAction, ActivityItemType } from "../../generated/prisma/client";
import { PrismaService } from "../../prisma/services/PrismaService";
import { FieldLocator } from "../../vapi/services/FieldLocator";
import { ReportAnalyser } from "../../vapi/services/ReportAnalyser";
import type { FinishedCallReport } from "../../vapi/types/FinishedCallReport";

@Injectable()
export class CallReanalysisService {
  private readonly logger = new Logger(CallReanalysisService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly callRepository: CallRepository,
    private readonly extractedFieldRepository: ExtractedFieldRepository,
    private readonly faqRepository: FaqRepository,
    private readonly reportAnalyser: ReportAnalyser,
    private readonly fieldLocator: FieldLocator,
    private readonly activityLog: ActivityLog,
    private readonly clock: Clock,
  ) {}

  async reanalyse(callId: string): Promise<boolean> {
    const call = await this.callRepository.findDetail(callId);
    if (!call) return false;
    const analysis = await this.reportAnalyser.analyse(this.toReport(call), false);
    if (!analysis.isComplete) {
      this.logger.warn(`Re-analysing call ${callId} did not complete, so the earlier analysis is kept`);
      return false;
    }
    const matchedFaq = analysis.matchedFaqNumber === null ? null : await this.faqRepository.findByNumber(analysis.matchedFaqNumber);
    await this.prismaService.$transaction(async (transaction) => {
      await this.callRepository.updateAnalysis(transaction, callId, { summary: analysis.summary, topic: analysis.topic, matchedFaqId: matchedFaq?.id ?? null });
      await this.extractedFieldRepository.replaceForCall(transaction, callId, this.fieldLocator.locate(analysis.fields, call.messages));
      await this.activityLog.record({ action: ActivityAction.callReanalysed, itemType: ActivityItemType.call, itemId: callId }, transaction);
    });
    return true;
  }

  private toReport(call: CallWithDetails): FinishedCallReport {
    return {
      callId: call.id,
      channel: call.channel,
      customerNumber: call.customerNumber,
      startedAt: call.startedAt,
      endedAt: call.endedAt ?? this.clock.now(),
      endedReason: call.endedReason,
      lines: call.messages.map((message) => ({ position: message.position, speaker: message.speaker, text: message.redactedText, secondsFromStart: message.secondsFromStart })),
      handOffReason: null,
    };
  }
}
