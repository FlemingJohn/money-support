import type { ReviewReason } from "@/types/ReviewReason";

export const reviewReasonLabels: Record<ReviewReason, string> = {
  handOff: "Hand-off",
  guardrail: "Personal data removed",
  lowConfidence: "Unclear detail",
};
