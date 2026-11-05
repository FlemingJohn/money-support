import { Injectable } from "@nestjs/common";
import { ActivityLog } from "../../activity/services/ActivityLog";
import { CallMessageRepository } from "../../calls/repositories/CallMessageRepository";
import { ActivityAction, ActivityItemType } from "../../generated/prisma/client";
import { ReviewTestRepository } from "../repositories/ReviewTestRepository";
import type { ReviewTestVerdict } from "../types/ReviewTestVerdict";
import { ReviewTestBuilder } from "./ReviewTestBuilder";

@Injectable()
export class ReviewTestWriter {
  constructor(
    private readonly reviewTestRepository: ReviewTestRepository,
    private readonly reviewTestBuilder: ReviewTestBuilder,
    private readonly callMessageRepository: CallMessageRepository,
    private readonly activityLog: ActivityLog,
  ) {}

  async saveForWrongVerdict(callId: string, verdict: ReviewTestVerdict): Promise<number | null> {
    const draft = this.reviewTestBuilder.build(await this.callMessageRepository.findForCall(callId), verdict);
    if (!draft) return null;
    const test = await this.reviewTestRepository.saveForReview(callId, draft);
    await this.activityLog.record({ action: ActivityAction.reviewTestCreated, itemType: ActivityItemType.reviewTest, itemId: test.id });
    return test.number;
  }

  removeForCorrectVerdict(callId: string): Promise<void> {
    return this.reviewTestRepository.deleteForReview(callId);
  }

  async findNumber(callId: string): Promise<number | null> {
    return (await this.reviewTestRepository.findForReview(callId))?.number ?? null;
  }
}
