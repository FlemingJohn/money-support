import { getFromBackend } from "@/lib/getFromBackend";
import type { ReviewTestList } from "@/types/ReviewTestList";

export function getReviewTests(): Promise<ReviewTestList> {
  return getFromBackend<ReviewTestList>("/agent-quality/tests");
}
