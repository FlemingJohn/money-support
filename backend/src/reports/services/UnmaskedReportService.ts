import { Injectable, Logger } from "@nestjs/common";
import { ActivityLog } from "../../activity/services/ActivityLog";
import { CallMessageRepository } from "../../calls/repositories/CallMessageRepository";
import { ActivityAction, ActivityItemType, GuardrailKind, ReviewReason } from "../../generated/prisma/client";
import { GuardrailEventRepository } from "../../guardrails/repositories/GuardrailEventRepository";
import { PrismaService } from "../../prisma/services/PrismaService";
import { MessageNotFoundException } from "../../review/exceptions/MessageNotFoundException";
import { ReviewRepository } from "../../review/repositories/ReviewRepository";
import { ReportedLineMasker } from "../clients/ReportedLineMasker";
import type { UnmaskedReportDto } from "../dto/UnmaskedReportDto";
import { MaskingMissRepository } from "../repositories/MaskingMissRepository";
import type { UnmaskedReportResponse } from "../responses/UnmaskedReportResponse";
import type { ReportDecision } from "../types/ReportDecision";
import { CallReanalysisService } from "./CallReanalysisService";
import { ReportDecider } from "./ReportDecider";

@Injectable()
export class UnmaskedReportService {
  private readonly logger = new Logger(UnmaskedReportService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly callMessageRepository: CallMessageRepository,
    private readonly guardrailEventRepository: GuardrailEventRepository,
    private readonly reviewRepository: ReviewRepository,
    private readonly maskingMissRepository: MaskingMissRepository,
    private readonly reportedLineMasker: ReportedLineMasker,
    private readonly reportDecider: ReportDecider,
    private readonly callReanalysisService: CallReanalysisService,
    private readonly activityLog: ActivityLog,
  ) {}

  async report(callId: string, report: UnmaskedReportDto): Promise<UnmaskedReportResponse> {
    const message = await this.callMessageRepository.findById(report.messageId);
    if (!message || message.callId !== callId) throw new MessageNotFoundException(callId, report.messageId);
    const decision = this.reportDecider.decide(message.redactedText, await this.reportedLineMasker.mask(message.redactedText), report);
    if (decision.outcome === "unchanged") return { text: decision.text, outcome: decision.outcome, isReanalysed: false };
    await this.save(callId, message.id, decision);
    const isReanalysed = await this.callReanalysisService.reanalyse(callId).catch((error: unknown) => {
      this.logger.error(`Re-analysing call ${callId} failed: ${String(error)}`);
      return false;
    });
    return { text: decision.text, outcome: decision.outcome, isReanalysed };
  }

  private async save(callId: string, messageId: string, decision: ReportDecision): Promise<void> {
    await this.prismaService.$transaction(async (transaction) => {
      await this.callMessageRepository.replaceText(transaction, messageId, decision.text);
      const entityTypes = decision.kinds.length > 0 ? decision.kinds : ["reported by a reviewer"];
      for (const entityType of entityTypes) {
        await this.guardrailEventRepository.addEvent(transaction, callId, { kind: GuardrailKind.unmaskedDataReported, entityType });
      }
      await this.maskingMissRepository.recordMisses(transaction, callId, messageId, decision.kinds, decision.text);
      await this.reviewRepository.openReview(transaction, callId, ReviewReason.guardrail);
      await this.activityLog.record({ action: ActivityAction.unmaskedDataReported, itemType: ActivityItemType.call, itemId: callId }, transaction);
      if (decision.kinds.length > 0) {
        await this.activityLog.record({ action: ActivityAction.maskingMissRecorded, itemType: ActivityItemType.call, itemId: callId }, transaction);
      }
    });
  }
}
