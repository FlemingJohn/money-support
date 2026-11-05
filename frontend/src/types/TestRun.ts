import type { TestRunCaseResult } from "@/types/TestRunCaseResult";

export interface TestRun {
  startedAt: string;
  finishedAt: string;
  passedCount: number;
  totalCount: number;
  results: TestRunCaseResult[];
}
