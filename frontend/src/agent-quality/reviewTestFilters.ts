import type { ReviewTestFilterOption } from "@/types/ReviewTestFilterOption";

export const reviewTestFilters: ReviewTestFilterOption[] = [
  { filter: "all", label: "All", matches: () => true },
  { filter: "failing", label: "Failing", matches: (test) => test.isEnabled && test.lastResult === "failed" },
  { filter: "passing", label: "Passing", matches: (test) => test.isEnabled && test.lastResult === "passed" },
  { filter: "off", label: "Off", matches: (test) => !test.isEnabled },
];
