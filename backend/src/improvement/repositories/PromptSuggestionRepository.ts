import { Injectable } from "@nestjs/common";
import { type PromptSuggestion, PromptSuggestionStatus } from "../../generated/prisma/client";
import type { DatabaseTransaction } from "../../prisma/types/DatabaseTransaction";
import { PrismaService } from "../../prisma/services/PrismaService";
import type { PromptSuggestionWithReviews } from "../types/PromptSuggestionWithReviews";
import type { SuggestionResult } from "../types/SuggestionResult";

@Injectable()
export class PromptSuggestionRepository {
  private readonly listLimit = 20;

  constructor(private readonly prismaService: PrismaService) {}

  startTesting(): Promise<PromptSuggestion> {
    return this.prismaService.promptSuggestion.create({ data: {} });
  }

  finishTesting(id: string, result: SuggestionResult): Promise<PromptSuggestionWithReviews> {
    return this.prismaService.promptSuggestion.update({
      where: { id },
      data: {
        ruleText: result.ruleText,
        explanation: result.explanation,
        status: result.isBetter ? PromptSuggestionStatus.pending : PromptSuggestionStatus.discarded,
        passedBefore: result.passedBefore,
        passedAfter: result.passedAfter,
        totalTests: result.totalTests,
        reviews: { create: result.reviewCallIds.map((reviewCallId) => ({ reviewCallId })) },
      },
      include: { reviews: true },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.promptSuggestion.delete({ where: { id } });
  }

  findById(id: string): Promise<PromptSuggestionWithReviews | null> {
    return this.prismaService.promptSuggestion.findUnique({ where: { id }, include: { reviews: true } });
  }

  findRecent(): Promise<PromptSuggestionWithReviews[]> {
    return this.prismaService.promptSuggestion.findMany({ orderBy: { createdAt: "desc" }, take: this.listLimit, include: { reviews: true } });
  }

  decide(transaction: DatabaseTransaction, id: string, status: PromptSuggestionStatus, decidedAt: Date): Promise<PromptSuggestionWithReviews> {
    return transaction.promptSuggestion.update({ where: { id }, data: { status, decidedAt }, include: { reviews: true } });
  }
}
