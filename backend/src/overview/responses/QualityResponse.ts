import type { QualityReasonCount } from "./QualityReasonCount";
import type { QualityVersionCount } from "./QualityVersionCount";

export interface QualityResponse {
  judgedCount: number;
  correctCount: number;
  wrongCount: number;
  wrongByReason: QualityReasonCount[];
  byPromptVersion: QualityVersionCount[];
}
