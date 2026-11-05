import { Injectable } from "@nestjs/common";
import { CallPresenter } from "../../calls/presenters/CallPresenter";
import { CallRepository } from "../../calls/repositories/CallRepository";
import { ReviewStatus } from "../../generated/prisma/client";
import { ReviewPresenter } from "../../review/presenters/ReviewPresenter";
import { ReviewRepository } from "../../review/repositories/ReviewRepository";
import { CallStatistics } from "./CallStatistics";
import type { OverviewResponse } from "../responses/OverviewResponse";
import type { QualityResponse } from "../responses/QualityResponse";
import { Clock } from "../../common/services/Clock";
import { PeriodRange } from "./PeriodRange";
import { QualityStatistics } from "./QualityStatistics";
import type { OverviewPeriod } from "../types/OverviewPeriod";
import type { CallVolumeCount } from "../responses/CallVolumeCount";
import type { Call } from "../../generated/prisma/client";

@Injectable()
export class OverviewService {
  private readonly recentCallLimit = 5;
  private readonly needsReviewLimit = 3;
  private readonly qualityWindowDays = 7;

  constructor(
    private readonly callRepository: CallRepository,
    private readonly reviewRepository: ReviewRepository,
    private readonly callPresenter: CallPresenter,
    private readonly reviewPresenter: ReviewPresenter,
    private readonly callStatistics: CallStatistics,
    private readonly periodRange: PeriodRange,
    private readonly qualityStatistics: QualityStatistics,
    private readonly clock: Clock,
  ) {}

  async getQuality(): Promise<QualityResponse> {
    const since = new Date(this.clock.now().getTime() - this.qualityWindowDays * 24 * 60 * 60 * 1000);
    return this.qualityStatistics.summarise(await this.reviewRepository.findJudgedSince(since));
  }

  async getOverview(period: OverviewPeriod): Promise<OverviewResponse> {
    const current = this.periodRange.current(period);
    const previous = this.periodRange.previous(period);
    const [currentCalls, previousCalls, recentCalls, openReviews] = await Promise.all([
      this.callRepository.findEndedBetween(current.start, current.end),
      this.callRepository.findEndedBetween(previous.start, previous.end),
      this.callRepository.findRecent(this.recentCallLimit),
      this.reviewRepository.findList(ReviewStatus.open, this.needsReviewLimit),
    ]);
    return {
      period,
      current: this.callStatistics.totals(currentCalls),
      previous: this.callStatistics.totals(previousCalls),
      callVolume: this.countCallVolume(period, currentCalls),
      handOffReasons: this.callStatistics.countHandOffReasons(currentCalls),
      recentCalls: recentCalls.map((call) => this.callPresenter.toSummary(call)),
      needsReview: openReviews.map((review) => this.reviewPresenter.toListItem(review)),
    };
  }

  private countCallVolume(period: OverviewPeriod, calls: Call[]): CallVolumeCount[] {
    if (period === "today") return this.callStatistics.countByHour(calls);
    return this.callStatistics.countByDay(calls, this.periodRange.getDayStarts(period));
  }
}
