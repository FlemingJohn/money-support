import { Injectable } from "@nestjs/common";
import type { ReviewTest } from "../../generated/prisma/client";
import type { ReviewTestCase } from "../types/ReviewTestCase";

@Injectable()
export class ReviewTestCaseBuilder {
  build(test: ReviewTest): ReviewTestCase {
    return {
      id: this.label(test.number),
      name: `From a review: ${test.callerLine.slice(0, 60)}`,
      turns: [
        { role: "user", content: test.callerLine },
        { role: "assistant", check: test.check, expectation: test.expectation },
      ],
    };
  }

  label(number: number): string {
    return `R${String(number).padStart(2, "0")}`;
  }
}
