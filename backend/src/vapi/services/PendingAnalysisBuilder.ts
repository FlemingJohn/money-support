import { Injectable } from "@nestjs/common";
import { ReviewReason } from "../../generated/prisma/client";
import type { CallAnalysis } from "../types/CallAnalysis";
import type { CallAnalysisInput } from "../types/CallAnalysisInput";

@Injectable()
export class PendingAnalysisBuilder {
  private readonly waitingText = "[waiting for privacy check]";
  private readonly handOffEndedReason = "assistant-said-end-call-phrase";

  build(input: CallAnalysisInput): CallAnalysis {
    return {
      lines: input.lines.map((line) => ({ ...this.withoutText(line), redactedText: this.waitingText, removedEntityTypes: [] })),
      summary: null,
      topic: null,
      matchedFaqNumber: null,
      isHandedOff: input.endedReason === this.handOffEndedReason,
      fields: [],
      suggestedReviewReason: ReviewReason.guardrail,
      isComplete: false,
    };
  }

  private withoutText(line: CallAnalysisInput["lines"][number]) {
    return { position: line.position, speaker: line.speaker, secondsFromStart: line.secondsFromStart };
  }
}
