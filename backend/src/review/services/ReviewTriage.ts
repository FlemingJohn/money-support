import { Injectable } from "@nestjs/common";
import { ReviewReason } from "../../generated/prisma/client";
import type { TriageFacts } from "../types/TriageFacts";

@Injectable()
export class ReviewTriage {
  private readonly lowConfidenceThreshold = 0.75;

  decideReason(facts: TriageFacts): ReviewReason | null {
    if (facts.isHandedOff) return ReviewReason.handOff;
    if (facts.removedEntityCount > 0 || facts.uncheckedLineCount > 0) return ReviewReason.guardrail;
    if (this.hasLowConfidenceField(facts.fieldConfidences)) return ReviewReason.lowConfidence;
    if (facts.suggestedReason === ReviewReason.possibleMistake) return ReviewReason.possibleMistake;
    return null;
  }

  private hasLowConfidenceField(fieldConfidences: number[]): boolean {
    return fieldConfidences.some((confidence) => confidence < this.lowConfidenceThreshold);
  }
}
