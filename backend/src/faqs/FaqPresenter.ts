import { Injectable } from "@nestjs/common";
import type { Faq } from "../generated/prisma/client";
import type { FaqResponse } from "./FaqResponse";

@Injectable()
export class FaqPresenter {
  toResponse(faq: Faq): FaqResponse {
    return {
      id: faq.id,
      number: faq.sortOrder,
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      isActive: faq.isActive,
      updatedAt: faq.updatedAt.toISOString(),
    };
  }
}
