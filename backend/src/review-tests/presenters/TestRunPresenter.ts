import { Injectable } from "@nestjs/common";
import type { TestRun } from "../../generated/prisma/client";
import type { TestRunResponse } from "../responses/TestRunResponse";
import type { TestRunResult } from "../types/TestRunResult";

@Injectable()
export class TestRunPresenter {
  toResponse(run: TestRun): TestRunResponse {
    return {
      startedAt: run.startedAt.toISOString(),
      finishedAt: run.finishedAt.toISOString(),
      passedCount: run.passedCount,
      totalCount: run.totalCount,
      results: run.results as unknown as TestRunResult[],
    };
  }
}
