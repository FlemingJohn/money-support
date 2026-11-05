import { Injectable } from "@nestjs/common";
import { ActivityLog } from "../../activity/services/ActivityLog";
import { ActivityAction, ActivityItemType, ReviewTestResult } from "../../generated/prisma/client";
import { TestRunPresenter } from "../presenters/TestRunPresenter";
import { ReviewTestRepository } from "../repositories/ReviewTestRepository";
import { TestRunRepository } from "../repositories/TestRunRepository";
import type { TestRunResponse } from "../responses/TestRunResponse";
import type { TestRunResult } from "../types/TestRunResult";

@Injectable()
export class TestRunRecorder {
  constructor(
    private readonly reviewTestRepository: ReviewTestRepository,
    private readonly testRunRepository: TestRunRepository,
    private readonly testRunPresenter: TestRunPresenter,
    private readonly activityLog: ActivityLog,
  ) {}

  async record(startedAt: Date, finishedAt: Date, results: TestRunResult[]): Promise<TestRunResponse> {
    for (const result of results) await this.saveReviewResult(result, finishedAt);
    const run = await this.testRunRepository.save(startedAt, finishedAt, results);
    await this.activityLog.record({ action: ActivityAction.reviewTestsRun, itemType: ActivityItemType.reviewTest, itemId: run.id });
    return this.testRunPresenter.toResponse(run);
  }

  private async saveReviewResult(result: TestRunResult, finishedAt: Date): Promise<void> {
    const number = Number(result.caseId.slice(1));
    if (!result.caseId.startsWith("R") || !Number.isInteger(number) || number <= 0) return;
    await this.reviewTestRepository.saveResult(number, result.status === "passed" ? ReviewTestResult.passed : ReviewTestResult.failed, finishedAt);
  }
}
