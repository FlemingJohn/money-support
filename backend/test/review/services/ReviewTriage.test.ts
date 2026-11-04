import { ReviewReason } from "../../../src/generated/prisma/client";
import { ReviewTriage } from "../../../src/review/services/ReviewTriage";
import type { TriageFacts } from "../../../src/review/types/TriageFacts";

describe("ReviewTriage", () => {
  const reviewTriage = new ReviewTriage();
  const cleanCall: TriageFacts = { isHandedOff: false, removedEntityCount: 0, uncheckedLineCount: 0, fieldConfidences: [0.9], suggestedReason: null };

  it("opens a hand-off review first", () => {
    expect(reviewTriage.decideReason({ ...cleanCall, isHandedOff: true, removedEntityCount: 2 })).toBe(ReviewReason.handOff);
  });

  it("opens a guardrail review when personal data was removed", () => {
    expect(reviewTriage.decideReason({ ...cleanCall, removedEntityCount: 1 })).toBe(ReviewReason.guardrail);
  });

  it("opens a guardrail review when a line is still waiting for its privacy check", () => {
    expect(reviewTriage.decideReason({ ...cleanCall, uncheckedLineCount: 1 })).toBe(ReviewReason.guardrail);
  });

  it("opens a low confidence review below 75 percent", () => {
    expect(reviewTriage.decideReason({ ...cleanCall, fieldConfidences: [0.9, 0.6] })).toBe(ReviewReason.lowConfidence);
  });

  it("opens a review when ai suspects a mistake", () => {
    expect(reviewTriage.decideReason({ ...cleanCall, suggestedReason: ReviewReason.possibleMistake })).toBe(ReviewReason.possibleMistake);
  });

  it("opens no review for a clean resolved call", () => {
    expect(reviewTriage.decideReason(cleanCall)).toBeNull();
  });
});
