import type { ReviewStatus } from "@/types/ReviewStatus";

export const reviewStatusLabels: Record<ReviewStatus, string> = {
  open: "Open",
  inProgress: "In progress",
  done: "Done",
};
