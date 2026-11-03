import { Injectable } from "@nestjs/common";
import { type Call, CallChannel } from "../generated/prisma/client";
import type { CallDetailResponse } from "./CallDetailResponse";
import type { CallSummaryResponse } from "./CallSummaryResponse";
import type { CallWithDetails } from "./CallWithDetails";

@Injectable()
export class CallPresenter {
  toSummary(call: Call): CallSummaryResponse {
    return {
      id: call.id,
      channel: call.channel,
      status: call.status,
      callerLabel: this.callerLabel(call),
      startedAt: call.startedAt?.toISOString() ?? null,
      durationSeconds: this.durationSeconds(call),
      topic: call.topic ?? "Untitled call",
      outcome: call.outcome,
    };
  }

  toDetail(call: CallWithDetails): CallDetailResponse {
    return {
      ...this.toSummary(call),
      summary: call.summary,
      endedReason: call.endedReason,
      promptVersionId: call.promptVersionId,
      matchedFaq: call.matchedFaq ? { id: call.matchedFaq.id, number: call.matchedFaq.sortOrder, question: call.matchedFaq.question } : null,
      messages: call.messages.map((message) => ({
        id: message.id,
        position: message.position,
        speaker: message.speaker,
        text: message.redactedText,
        secondsFromStart: message.secondsFromStart,
      })),
      extractedFields: call.extractedFields.map(({ callId, ...field }) => field),
      guardrailEvents: call.guardrailEvents.map((event) => ({
        id: event.id,
        kind: event.kind,
        entityType: event.entityType,
        createdAt: event.createdAt.toISOString(),
      })),
      review: call.review ? { status: call.review.status, reason: call.review.reason } : null,
    };
  }

  private callerLabel(call: Call): string {
    if (call.maskedCustomerNumber) return call.maskedCustomerNumber;
    return call.channel === CallChannel.web ? "Web call" : "Unknown number";
  }

  private durationSeconds(call: Call): number | null {
    if (!call.startedAt || !call.endedAt) return null;
    return Math.round((call.endedAt.getTime() - call.startedAt.getTime()) / 1000);
  }
}
