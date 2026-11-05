import { Injectable } from "@nestjs/common";
import { ReviewVerdict, type VerdictReason } from "../../generated/prisma/client";
import type { JudgedReview } from "../../review/types/JudgedReview";
import type { QualityReasonCount } from "../responses/QualityReasonCount";
import type { QualityResponse } from "../responses/QualityResponse";
import type { QualityVersionCount } from "../responses/QualityVersionCount";

@Injectable()
export class QualityStatistics {
  summarise(reviews: JudgedReview[]): QualityResponse {
    const wrong = reviews.filter((review) => review.verdict === ReviewVerdict.wrong);
    return {
      judgedCount: reviews.length,
      correctCount: reviews.length - wrong.length,
      wrongCount: wrong.length,
      wrongByReason: this.countReasons(wrong),
      byPromptVersion: this.countVersions(reviews),
    };
  }

  private countReasons(wrong: JudgedReview[]): QualityReasonCount[] {
    const counts = new Map<VerdictReason, number>();
    wrong.forEach((review) => review.verdictReason && counts.set(review.verdictReason, (counts.get(review.verdictReason) ?? 0) + 1));
    return [...counts].map(([reason, count]) => ({ reason, count })).sort((first, second) => second.count - first.count);
  }

  private countVersions(reviews: JudgedReview[]): QualityVersionCount[] {
    const versions = new Map<string, QualityVersionCount>();
    for (const review of reviews) {
      const version = review.call.promptVersion;
      if (!version) continue;
      const current = versions.get(version.id) ?? { promptVersionId: version.id, createdAt: version.createdAt.toISOString(), judgedCount: 0, wrongCount: 0 };
      current.judgedCount += 1;
      current.wrongCount += review.verdict === ReviewVerdict.wrong ? 1 : 0;
      versions.set(version.id, current);
    }
    return [...versions.values()].sort((first, second) => first.createdAt.localeCompare(second.createdAt));
  }
}
