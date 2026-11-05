import { Injectable } from "@nestjs/common";
import { type CallMessage, ReviewTestCheck, Speaker, VerdictReason } from "../../generated/prisma/client";
import { defaultExpectations } from "../catalogs/defaultExpectations";
import type { ReviewTestDraft } from "../types/ReviewTestDraft";
import type { ReviewTestVerdict } from "../types/ReviewTestVerdict";

@Injectable()
export class ReviewTestBuilder {
  build(messages: CallMessage[], verdict: ReviewTestVerdict): ReviewTestDraft | null {
    const ordered = [...messages].sort((first, second) => first.position - second.position);
    const wrongReply = this.findWrongReply(ordered, verdict.verdictMessageId);
    if (!wrongReply) return null;
    const callerLine = ordered.filter((message) => message.speaker === Speaker.caller && message.position < wrongReply.position).at(-1);
    if (!callerLine) return null;
    return {
      callerLine: callerLine.redactedText,
      check: verdict.verdictReason === VerdictReason.shouldHaveHandedOff ? ReviewTestCheck.handsOff : ReviewTestCheck.answers,
      expectation: verdict.expectedBehaviour?.trim() || defaultExpectations[verdict.verdictReason],
      verdictReason: verdict.verdictReason,
    };
  }

  private findWrongReply(messages: CallMessage[], verdictMessageId: string | null): CallMessage | undefined {
    const agentLines = messages.filter((message) => message.speaker === Speaker.agent);
    return agentLines.find((message) => message.id === verdictMessageId) ?? agentLines.filter((message) => this.hasCallerBefore(messages, message)).at(-1);
  }

  private hasCallerBefore(messages: CallMessage[], agentLine: CallMessage): boolean {
    return messages.some((message) => message.speaker === Speaker.caller && message.position < agentLine.position);
  }
}
