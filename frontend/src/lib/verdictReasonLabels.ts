import type { VerdictReason } from "@/types/VerdictReason";

export const verdictReasonLabels: Record<VerdictReason, string> = {
  shouldHaveAnswered: "Should have answered",
  shouldHaveHandedOff: "Should have handed off",
  wrongInformation: "Gave wrong information",
  tooLongOrUnclear: "Too long or unclear",
  repeatedPersonalData: "Repeated personal data",
};
