import type { TestRunCaseResult } from "@/types/TestRunCaseResult";

export interface TestRunProgressProps {
  total: number;
  results: TestRunCaseResult[];
}
