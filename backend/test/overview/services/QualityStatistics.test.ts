import { ReviewVerdict, VerdictReason } from "../../../src/generated/prisma/client";
import { QualityStatistics } from "../../../src/overview/services/QualityStatistics";
import type { JudgedReview } from "../../../src/review/types/JudgedReview";

describe("QualityStatistics", () => {
  const statistics = new QualityStatistics();
  const olderVersion = { id: "v13", createdAt: new Date("2026-11-03T10:00:00Z") };
  const newerVersion = { id: "v14", createdAt: new Date("2026-11-05T10:00:00Z") };
  const makeReview = (verdict: ReviewVerdict, verdictReason: VerdictReason | null, promptVersion: typeof olderVersion) =>
    ({ verdict, verdictReason, call: { promptVersion } }) as unknown as JudgedReview;
  const reviews = [
    makeReview(ReviewVerdict.wrong, VerdictReason.shouldHaveHandedOff, olderVersion),
    makeReview(ReviewVerdict.wrong, VerdictReason.shouldHaveHandedOff, olderVersion),
    makeReview(ReviewVerdict.wrong, VerdictReason.tooLongOrUnclear, olderVersion),
    makeReview(ReviewVerdict.correct, null, newerVersion),
  ];

  it("counts correct and wrong verdicts and the most common mistake first", () => {
    const quality = statistics.summarise(reviews);
    expect(quality).toMatchObject({ judgedCount: 4, correctCount: 1, wrongCount: 3 });
    expect(quality.wrongByReason).toEqual([
      { reason: VerdictReason.shouldHaveHandedOff, count: 2 },
      { reason: VerdictReason.tooLongOrUnclear, count: 1 },
    ]);
  });

  it("compares mistakes by prompt version, oldest first", () => {
    expect(statistics.summarise(reviews).byPromptVersion).toEqual([
      { promptVersionId: "v13", createdAt: "2026-11-03T10:00:00.000Z", judgedCount: 3, wrongCount: 3 },
      { promptVersionId: "v14", createdAt: "2026-11-05T10:00:00.000Z", judgedCount: 1, wrongCount: 0 },
    ]);
  });
});
