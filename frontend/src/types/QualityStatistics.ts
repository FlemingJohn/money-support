import type { QualityReasonCount } from "@/types/QualityReasonCount";
import type { QualityVersionCount } from "@/types/QualityVersionCount";

export interface QualityStatistics {
  judgedCount: number;
  correctCount: number;
  wrongCount: number;
  wrongByReason: QualityReasonCount[];
  byPromptVersion: QualityVersionCount[];
}
