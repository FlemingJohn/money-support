import { Injectable } from "@nestjs/common";
import { CallChannel, type Review } from "../generated/prisma/client";
import type { ReviewListItemResponse } from "./ReviewListItemResponse";
import type { ReviewResponse } from "./ReviewResponse";
import type { ReviewWithCall } from "./ReviewWithCall";

@Injectable()
export class ReviewPresenter {
  toListItem(review: ReviewWithCall): ReviewListItemResponse {
    return {
      callId: review.callId,
      topic: review.call.topic ?? "Untitled call",
      reason: review.reason,
      status: review.status,
      hasRemovedData: review.call._count.guardrailEvents > 0,
      isPhoneCall: review.call.channel === CallChannel.phone,
      startedAt: review.call.startedAt?.toISOString() ?? null,
    };
  }

  toResponse(review: Review): ReviewResponse {
    return {
      callId: review.callId,
      status: review.status,
      reason: review.reason,
      note: review.note,
      verdict: review.verdict,
      verdictReason: review.verdictReason,
      expectedBehaviour: review.expectedBehaviour,
      resolvedAt: review.resolvedAt?.toISOString() ?? null,
    };
  }
}
