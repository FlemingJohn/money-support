import type { ReviewTest } from "@/types/ReviewTest";
import type { ReviewTestFilter } from "@/types/ReviewTestFilter";

export interface ReviewTestFilterOption {
  filter: ReviewTestFilter;
  label: string;
  matches: (test: ReviewTest) => boolean;
}
