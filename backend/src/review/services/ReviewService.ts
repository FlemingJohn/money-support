import { Injectable } from "@nestjs/common";
import { ActivityLog } from "../../activity/services/ActivityLog";
import { CallQueryService } from "../../calls/services/CallQueryService";
import { ExtractedFieldRepository } from "../../calls/repositories/ExtractedFieldRepository";
import { Clock } from "../../common/services/Clock";
import { ActivityAction, ActivityItemType, type Review, ReviewStatus, ReviewVerdict } from "../../generated/prisma/client";
import type { ReviewDetailResponse } from "../responses/ReviewDetailResponse";
import type { ReviewListResponse } from "../responses/ReviewListResponse";
import { ReviewNotFoundException } from "../exceptions/ReviewNotFoundException";
import { ReviewPresenter } from "../presenters/ReviewPresenter";
import { ReviewRepository } from "../repositories/ReviewRepository";
import type { ReviewResponse } from "../responses/ReviewResponse";
import type { ReviewUpdateDto } from "../dto/ReviewUpdateDto";
import type { ReviewVerdictDto } from "../dto/ReviewVerdictDto";
import { ReviewTestWriter } from "../../review-tests/services/ReviewTestWriter";

@Injectable()
export class ReviewService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly reviewPresenter: ReviewPresenter,
    private readonly callQueryService: CallQueryService,
    private readonly extractedFieldRepository: ExtractedFieldRepository,
    private readonly activityLog: ActivityLog,
    private readonly clock: Clock,
    private readonly reviewTestWriter: ReviewTestWriter,
  ) {}

  async list(status: ReviewStatus): Promise<ReviewListResponse> {
    const [reviews, counts] = await Promise.all([this.reviewRepository.findList(status), this.reviewRepository.countByStatus()]);
    return { reviews: reviews.map((review) => this.reviewPresenter.toListItem(review)), counts };
  }

  async getDetail(callId: string): Promise<ReviewDetailResponse> {
    const review = await this.requireReview(callId);
    const [call, reviewTestNumber] = await Promise.all([this.callQueryService.getDetail(callId), this.reviewTestWriter.findNumber(callId)]);
    return { review: this.reviewPresenter.toResponse(review, reviewTestNumber), call };
  }

  async update(callId: string, changes: ReviewUpdateDto): Promise<ReviewResponse> {
    await this.requireReview(callId);
    const isResolving = changes.status === ReviewStatus.done;
    const review = await this.reviewRepository.update(callId, {
      ...changes,
      resolvedAt: isResolving ? this.clock.now() : undefined,
    });
    await this.recordActivity(isResolving ? ActivityAction.reviewResolved : ActivityAction.reviewUpdated, callId);
    return this.reviewPresenter.toResponse(review);
  }

  async saveVerdict(callId: string, verdict: ReviewVerdictDto): Promise<ReviewResponse> {
    const current = await this.requireReview(callId);
    const review = await this.reviewRepository.update(callId, {
      verdict: verdict.verdict,
      verdictReason: verdict.verdictReason ?? null,
      expectedBehaviour: verdict.expectedBehaviour ?? null,
      verdictMessage: verdict.verdictMessageId ? { connect: { id: verdict.verdictMessageId } } : { disconnect: true },
      ...(current.status === ReviewStatus.open ? { status: ReviewStatus.inProgress } : {}),
    });
    await this.recordActivity(ActivityAction.reviewVerdictSaved, callId);
    return this.reviewPresenter.toResponse(review, await this.saveReviewTest(callId, verdict));
  }

  private async saveReviewTest(callId: string, verdict: ReviewVerdictDto): Promise<number | null> {
    if (verdict.verdict === ReviewVerdict.correct || !verdict.verdictReason) {
      await this.reviewTestWriter.removeForCorrectVerdict(callId);
      return null;
    }
    return this.reviewTestWriter.saveForWrongVerdict(callId, {
      verdictReason: verdict.verdictReason,
      expectedBehaviour: verdict.expectedBehaviour ?? null,
      verdictMessageId: verdict.verdictMessageId ?? null,
    });
  }

  async confirmFields(callId: string): Promise<ReviewDetailResponse> {
    await this.requireReview(callId);
    await this.extractedFieldRepository.confirmAllForCall(callId);
    await this.recordActivity(ActivityAction.reviewUpdated, callId);
    return this.getDetail(callId);
  }

  private async requireReview(callId: string): Promise<Review> {
    const review = await this.reviewRepository.findByCallId(callId);
    if (!review) throw new ReviewNotFoundException(callId);
    return review;
  }

  private recordActivity(action: ActivityAction, callId: string): Promise<void> {
    return this.activityLog.record({ action, itemType: ActivityItemType.review, itemId: callId });
  }
}
