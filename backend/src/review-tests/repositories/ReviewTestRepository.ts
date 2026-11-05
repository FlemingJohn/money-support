import { Injectable } from "@nestjs/common";
import type { ReviewTest, ReviewTestResult } from "../../generated/prisma/client";
import { PrismaService } from "../../prisma/services/PrismaService";
import type { ReviewTestDraft } from "../types/ReviewTestDraft";

@Injectable()
export class ReviewTestRepository {
  constructor(private readonly prismaService: PrismaService) {}

  saveForReview(reviewCallId: string, draft: ReviewTestDraft): Promise<ReviewTest> {
    return this.prismaService.reviewTest.upsert({
      where: { reviewCallId },
      create: { reviewCallId, ...draft },
      update: { ...draft, isEnabled: true, lastResult: "notRun", lastRunAt: null },
    });
  }

  async deleteForReview(reviewCallId: string): Promise<void> {
    await this.prismaService.reviewTest.deleteMany({ where: { reviewCallId } });
  }

  findForReview(reviewCallId: string): Promise<ReviewTest | null> {
    return this.prismaService.reviewTest.findUnique({ where: { reviewCallId } });
  }

  findAll(): Promise<ReviewTest[]> {
    return this.prismaService.reviewTest.findMany({ orderBy: { number: "desc" } });
  }

  findEnabled(): Promise<ReviewTest[]> {
    return this.prismaService.reviewTest.findMany({ where: { isEnabled: true }, orderBy: { number: "asc" } });
  }

  findNotPassing(limit: number): Promise<ReviewTest[]> {
    return this.prismaService.reviewTest.findMany({ where: { isEnabled: true, lastResult: { not: "passed" }, reviewCallId: { not: null } }, orderBy: { number: "desc" }, take: limit });
  }

  setEnabled(id: string, isEnabled: boolean): Promise<ReviewTest> {
    return this.prismaService.reviewTest.update({ where: { id }, data: { isEnabled } });
  }

  async saveResult(number: number, lastResult: ReviewTestResult, lastRunAt: Date): Promise<void> {
    await this.prismaService.reviewTest.updateMany({ where: { number }, data: { lastResult, lastRunAt } });
  }
}
