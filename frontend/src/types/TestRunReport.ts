import type { TestRunCaseResult } from "@/types/TestRunCaseResult";

export interface TestRunReport {
  passedCount: number;
  totalCount: number;
  results: TestRunCaseResult[];
}
