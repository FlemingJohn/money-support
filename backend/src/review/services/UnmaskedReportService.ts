import { Injectable } from "@nestjs/common";
import { ActivityLog } from "../../activity/services/ActivityLog";
import { CallMessageRepository } from "../../calls/repositories/CallMessageRepository";
import { ActivityAction, ActivityItemType, GuardrailKind, ReviewReason } from "../../generated/prisma/client";
import { GuardrailEventRepository } from "../../guardrails/repositories/GuardrailEventRepository";
import { PrismaService } from "../../prisma/services/PrismaService";
import { MessageNotFoundException } from "../exceptions/MessageNotFoundException";
import { ReviewRepository } from "../repositories/ReviewRepository";

@Injectable()
export class UnmaskedReportService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly callMessageRepository: CallMessageRepository,
    private readonly guardrailEventRepository: GuardrailEventRepository,
    private readonly reviewRepository: ReviewRepository,
    private readonly activityLog: ActivityLog,
  ) {}

  async report(callId: string, messageId: string): Promise<void> {
    const message = await this.callMessageRepository.findById(messageId);
    if (!message || message.callId !== callId) throw new MessageNotFoundException(callId, messageId);
    await this.prismaService.$transaction(async (transaction) => {
      await this.callMessageRepository.hide(transaction, messageId);
      await this.guardrailEventRepository.addEvent(transaction, callId, {
        kind: GuardrailKind.unmaskedDataReported,
        entityType: "reported by a reviewer",
      });
      await this.reviewRepository.openReview(transaction, callId, ReviewReason.guardrail);
      await this.activityLog.record(
        { action: ActivityAction.unmaskedDataReported, itemType: ActivityItemType.call, itemId: callId },
        transaction,
      );
    });
  }
}
