import type { TestRunResult } from "../types/TestRunResult";

export interface TestRunResponse {
  passedCount: number;
  totalCount: number;
  results: TestRunResult[];
}
