import { Injectable } from "@nestjs/common";
import type { ActivityEventInput } from "../activity/ActivityEventInput";
import { ActivityLog } from "../activity/ActivityLog";
import { CallMessageRepository } from "../calls/repositories/CallMessageRepository";
import { CallRepository } from "../calls/repositories/CallRepository";
import { ExtractedFieldRepository } from "../calls/repositories/ExtractedFieldRepository";
import { ActivityAction, ActivityItemType, GuardrailKind, type ReviewReason } from "../generated/prisma/client";
import type { GuardrailEventInput } from "../guardrails/GuardrailEventInput";
import { GuardrailEventRepository } from "../guardrails/GuardrailEventRepository";
import type { DatabaseTransaction } from "../prisma/types/DatabaseTransaction";
import { PrismaService } from "../prisma/services/PrismaService";
import { ReviewRepository } from "../review/ReviewRepository";
import { FieldLocator } from "./FieldLocator";
import type { FinishedCallRecording } from "./FinishedCallRecording";
import type { RedactedReport } from "./RedactedReport";

@Injectable()
export class FinishedCallWriter {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly callRepository: CallRepository,
    private readonly callMessageRepository: CallMessageRepository,
    private readonly extractedFieldRepository: ExtractedFieldRepository,
    private readonly guardrailEventRepository: GuardrailEventRepository,
    private readonly reviewRepository: ReviewRepository,
    private readonly fieldLocator: FieldLocator,
    private readonly activityLog: ActivityLog,
  ) {}

  async write(recording: FinishedCallRecording): Promise<void> {
    const { completion, redactedReport, reviewReason } = recording;
    await this.prismaService.$transaction(async (transaction) => {
      await this.callRepository.completeCall(transaction, completion);
      const messages = await this.callMessageRepository.replaceForCall(transaction, completion.callId, redactedReport.lines);
      const fields = this.fieldLocator.locate(redactedReport.fields, messages);
      await this.extractedFieldRepository.replaceForCall(transaction, completion.callId, fields);
      await this.guardrailEventRepository.replaceRemovedDataEvents(transaction, completion.callId, this.removedDataEvents(redactedReport));
      await this.openReview(transaction, completion.callId, reviewReason);
      await this.activityLog.record(this.completionActivity(recording), transaction);
    });
  }

  private async openReview(transaction: DatabaseTransaction, callId: string, reviewReason: ReviewReason | null): Promise<void> {
    if (reviewReason === null) return;
    await this.reviewRepository.openReview(transaction, callId, reviewReason);
  }

  private removedDataEvents(redactedReport: RedactedReport): GuardrailEventInput[] {
    return redactedReport.lines.flatMap((line) =>
      line.removedEntityTypes.map((entityType) => ({ kind: GuardrailKind.personalDataRemoved, entityType })),
    );
  }

  private completionActivity(recording: FinishedCallRecording): ActivityEventInput {
    return {
      action: recording.report.isHandedOff ? ActivityAction.callHandedOff : ActivityAction.callCompleted,
      itemType: ActivityItemType.call,
      itemId: recording.completion.callId,
    };
  }
}
