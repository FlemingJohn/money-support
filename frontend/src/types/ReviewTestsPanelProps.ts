import type { ReviewTest } from "@/types/ReviewTest";
import type { TestRun } from "@/types/TestRun";

export interface ReviewTestsPanelProps {
  tests: ReviewTest[];
  lastRun: TestRun | null;
}
