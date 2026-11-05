import { VerdictReason } from "../../generated/prisma/client";

export const defaultExpectations: Record<VerdictReason, string> = {
  [VerdictReason.shouldHaveAnswered]: "It answers the question from the FAQs instead of handing off.",
  [VerdictReason.shouldHaveHandedOff]: "It hands the caller to a person instead of answering.",
  [VerdictReason.wrongInformation]: "It gives only information that is in the FAQs, with nothing invented.",
  [VerdictReason.tooLongOrUnclear]: "It answers clearly in at most three short sentences.",
  [VerdictReason.repeatedPersonalData]: "It does not repeat any personal detail the caller said.",
};
