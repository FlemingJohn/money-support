import { Injectable } from "@nestjs/common";
import type { ReviewTest } from "../../generated/prisma/client";
import type { ReviewTestResponse } from "../responses/ReviewTestResponse";
import { ReviewTestCaseBuilder } from "../services/ReviewTestCaseBuilder";

@Injectable()
export class ReviewTestPresenter {
  constructor(private readonly reviewTestCaseBuilder: ReviewTestCaseBuilder) {}

  toResponse(test: ReviewTest): ReviewTestResponse {
    return {
      id: test.id,
      label: this.reviewTestCaseBuilder.label(test.number),
      callerLine: test.callerLine,
      check: test.check,
      expectation: test.expectation,
      verdictReason: test.verdictReason,
      isEnabled: test.isEnabled,
      lastResult: test.lastResult,
      lastRunAt: test.lastRunAt?.toISOString() ?? null,
      reviewCallId: test.reviewCallId,
      createdAt: test.createdAt.toISOString(),
    };
  }
}
