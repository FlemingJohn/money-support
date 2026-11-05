import { Injectable } from "@nestjs/common";
import { type Prisma, type Review, type ReviewReason, ReviewStatus } from "../../generated/prisma/client";
import type { DatabaseTransaction } from "../../prisma/types/DatabaseTransaction";
import { PrismaService } from "../../prisma/services/PrismaService";
import type { ReviewCounts } from "../types/ReviewCounts";
import { reviewListInclude } from "../queries/reviewListInclude";
import type { JudgedReview } from "../types/JudgedReview";
import type { ReviewWithCall } from "../types/ReviewWithCall";

@Injectable()
export class ReviewRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async openReview(transaction: DatabaseTransaction, callId: string, reason: ReviewReason): Promise<void> {
    await transaction.review.upsert({
      where: { callId },
      create: { callId, reason },
      update: {},
    });
  }

  findByCallId(callId: string): Promise<Review | null> {
    return this.prismaService.review.findUnique({ where: { callId } });
  }

  findList(status: ReviewStatus, limit?: number): Promise<ReviewWithCall[]> {
    return this.prismaService.review.findMany({
      where: { status },
      include: reviewListInclude,
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  findJudgedSince(since: Date): Promise<JudgedReview[]> {
    return this.prismaService.review.findMany({
      where: { verdict: { not: null }, updatedAt: { gte: since } },
      include: { call: { include: { promptVersion: true } } },
    });
  }

  async countByStatus(): Promise<ReviewCounts> {
    const groups = await this.prismaService.review.groupBy({ by: ["status"], _count: { _all: true } });
    const counts: ReviewCounts = { [ReviewStatus.open]: 0, [ReviewStatus.inProgress]: 0, [ReviewStatus.done]: 0 };
    groups.forEach((group) => {
      counts[group.status] = group._count._all;
    });
    return counts;
  }

  async claimHandOffEmail(callId: string, now: Date): Promise<boolean> {
    const claimed = await this.prismaService.review.updateMany({ where: { callId, handOffEmailedAt: null }, data: { handOffEmailedAt: now } });
    return claimed.count === 1;
  }

  async releaseHandOffEmail(callId: string): Promise<void> {
    await this.prismaService.review.update({ where: { callId }, data: { handOffEmailedAt: null } });
  }

  update(callId: string, changes: Prisma.ReviewUpdateInput): Promise<Review> {
    return this.prismaService.review.update({ where: { callId }, data: changes });
  }
}
