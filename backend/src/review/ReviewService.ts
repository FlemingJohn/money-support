import { Injectable } from "@nestjs/common";
import { ActivityLog } from "../activity/ActivityLog";
import { CallQueryService } from "../calls/services/CallQueryService";
import { ExtractedFieldRepository } from "../calls/repositories/ExtractedFieldRepository";
import { Clock } from "../common/services/Clock";
import { ActivityAction, ActivityItemType, type Review, ReviewStatus } from "../generated/prisma/client";
import type { ReviewDetailResponse } from "./ReviewDetailResponse";
import type { ReviewListResponse } from "./ReviewListResponse";
import { ReviewNotFoundException } from "./ReviewNotFoundException";
import { ReviewPresenter } from "./ReviewPresenter";
import { ReviewRepository } from "./ReviewRepository";
import type { ReviewResponse } from "./ReviewResponse";
import type { ReviewUpdateDto } from "./ReviewUpdateDto";
import type { ReviewVerdictDto } from "./ReviewVerdictDto";

@Injectable()
export class ReviewService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly reviewPresenter: ReviewPresenter,
    private readonly callQueryService: CallQueryService,
    private readonly extractedFieldRepository: ExtractedFieldRepository,
    private readonly activityLog: ActivityLog,
    private readonly clock: Clock,
  ) {}

  async list(status: ReviewStatus): Promise<ReviewListResponse> {
    const [reviews, counts] = await Promise.all([this.reviewRepository.findList(status), this.reviewRepository.countByStatus()]);
    return { reviews: reviews.map((review) => this.reviewPresenter.toListItem(review)), counts };
  }

  async getDetail(callId: string): Promise<ReviewDetailResponse> {
    const review = await this.requireReview(callId);
    return { review: this.reviewPresenter.toResponse(review), call: await this.callQueryService.getDetail(callId) };
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
    await this.requireReview(callId);
    const review = await this.reviewRepository.update(callId, {
      verdict: verdict.verdict,
      verdictReason: verdict.verdictReason ?? null,
      expectedBehaviour: verdict.expectedBehaviour ?? null,
    });
    await this.recordActivity(ActivityAction.reviewVerdictSaved, callId);
    return this.reviewPresenter.toResponse(review);
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
