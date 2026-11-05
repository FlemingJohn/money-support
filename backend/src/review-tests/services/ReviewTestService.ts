import { Injectable } from "@nestjs/common";
import { ActivityLog } from "../../activity/services/ActivityLog";
import { Clock } from "../../common/services/Clock";
import { ActivityAction, ActivityItemType, ReviewTestResult } from "../../generated/prisma/client";
import { AiTestRunClient } from "../clients/AiTestRunClient";
import { ReviewTestPresenter } from "../presenters/ReviewTestPresenter";
import { ReviewTestRepository } from "../repositories/ReviewTestRepository";
import type { ReviewTestListResponse } from "../responses/ReviewTestListResponse";
import type { ReviewTestResponse } from "../responses/ReviewTestResponse";
import type { TestRunResponse } from "../responses/TestRunResponse";
import type { ReviewTestCase } from "../types/ReviewTestCase";
import type { TestRunResult } from "../types/TestRunResult";
import { ReviewTestCaseBuilder } from "./ReviewTestCaseBuilder";

@Injectable()
export class ReviewTestService {
  constructor(
    private readonly reviewTestRepository: ReviewTestRepository,
    private readonly reviewTestPresenter: ReviewTestPresenter,
    private readonly reviewTestCaseBuilder: ReviewTestCaseBuilder,
    private readonly aiTestRunClient: AiTestRunClient,
    private readonly activityLog: ActivityLog,
    private readonly clock: Clock,
  ) {}

  async list(): Promise<ReviewTestListResponse> {
    const tests = await this.reviewTestRepository.findAll();
    return { tests: tests.map((test) => this.reviewTestPresenter.toResponse(test)) };
  }

  async setEnabled(id: string, isEnabled: boolean): Promise<ReviewTestResponse> {
    return this.reviewTestPresenter.toResponse(await this.reviewTestRepository.setEnabled(id, isEnabled));
  }

  async listEnabledCases(): Promise<ReviewTestCase[]> {
    const tests = await this.reviewTestRepository.findEnabled();
    return tests.map((test) => this.reviewTestCaseBuilder.build(test));
  }

  async runAll(): Promise<TestRunResponse> {
    const results = await this.aiTestRunClient.runAll();
    const now = this.clock.now();
    for (const result of results) await this.saveReviewResult(result, now);
    await this.activityLog.record({ action: ActivityAction.reviewTestsRun, itemType: ActivityItemType.reviewTest, itemId: "all" });
    return { passedCount: results.filter((result) => result.status === "passed").length, totalCount: results.length, results };
  }

  private async saveReviewResult(result: TestRunResult, now: Date): Promise<void> {
    const number = Number(result.caseId.slice(1));
    if (!result.caseId.startsWith("R") || !Number.isInteger(number) || number <= 0) return;
    await this.reviewTestRepository.saveResult(number, result.status === "passed" ? ReviewTestResult.passed : ReviewTestResult.failed, now);
  }
}
