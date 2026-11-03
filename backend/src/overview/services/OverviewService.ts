import { Injectable } from "@nestjs/common";
import { CallPresenter } from "../../calls/presenters/CallPresenter";
import { CallRepository } from "../../calls/repositories/CallRepository";
import { ReviewStatus } from "../../generated/prisma/client";
import { ReviewPresenter } from "../../review/presenters/ReviewPresenter";
import { ReviewRepository } from "../../review/repositories/ReviewRepository";
import { CallStatistics } from "./CallStatistics";
import { DayRange } from "./DayRange";
import type { OverviewResponse } from "../responses/OverviewResponse";

@Injectable()
export class OverviewService {
  private readonly recentCallLimit = 5;
  private readonly needsReviewLimit = 3;

  constructor(
    private readonly callRepository: CallRepository,
    private readonly reviewRepository: ReviewRepository,
    private readonly callPresenter: CallPresenter,
    private readonly reviewPresenter: ReviewPresenter,
    private readonly callStatistics: CallStatistics,
    private readonly dayRange: DayRange,
  ) {}

  async getOverview(): Promise<OverviewResponse> {
    const today = this.dayRange.today();
    const yesterday = this.dayRange.yesterday();
    const [todayCalls, yesterdayCalls, recentCalls, openReviews] = await Promise.all([
      this.callRepository.findEndedBetween(today.start, today.end),
      this.callRepository.findEndedBetween(yesterday.start, yesterday.end),
      this.callRepository.findRecent(this.recentCallLimit),
      this.reviewRepository.findList(ReviewStatus.open, this.needsReviewLimit),
    ]);
    return {
      today: this.callStatistics.totals(todayCalls),
      yesterday: this.callStatistics.totals(yesterdayCalls),
      callsPerHour: this.callStatistics.countByHour(todayCalls),
      handOffReasons: this.callStatistics.countHandOffReasons(todayCalls),
      recentCalls: recentCalls.map((call) => this.callPresenter.toSummary(call)),
      needsReview: openReviews.map((review) => this.reviewPresenter.toListItem(review)),
    };
  }
}
