import { ReviewReason } from "../../../src/generated/prisma/client";
import { ReviewTriage } from "../../../src/review/services/ReviewTriage";

describe("ReviewTriage", () => {
  const reviewTriage = new ReviewTriage();

  it("opens a hand-off review first", () => {
    expect(reviewTriage.decideReason({ isHandedOff: true, removedEntityCount: 2, fieldConfidences: [0.4] })).toBe(ReviewReason.handOff);
  });

  it("opens a guardrail review when personal data was removed", () => {
    expect(reviewTriage.decideReason({ isHandedOff: false, removedEntityCount: 1, fieldConfidences: [] })).toBe(ReviewReason.guardrail);
  });

  it("opens a low confidence review below 75 percent", () => {
    expect(reviewTriage.decideReason({ isHandedOff: false, removedEntityCount: 0, fieldConfidences: [0.9, 0.74] })).toBe(ReviewReason.lowConfidence);
  });

  it("opens no review for a clean resolved call", () => {
    expect(reviewTriage.decideReason({ isHandedOff: false, removedEntityCount: 0, fieldConfidences: [0.75, 0.9] })).toBeNull();
  });
});
