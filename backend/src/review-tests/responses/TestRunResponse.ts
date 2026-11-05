import type { TestRunResult } from "../types/TestRunResult";

export interface TestRunResponse {
  startedAt: string;
  finishedAt: string;
  passedCount: number;
  totalCount: number;
  results: TestRunResult[];
}
