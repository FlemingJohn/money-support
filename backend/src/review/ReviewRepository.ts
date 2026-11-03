import { Injectable } from "@nestjs/common";
import { type Prisma, type Review, type ReviewReason, ReviewStatus } from "../generated/prisma/client";
import type { DatabaseTransaction } from "../prisma/types/DatabaseTransaction";
import { PrismaService } from "../prisma/services/PrismaService";
import type { ReviewCounts } from "./ReviewCounts";
import { reviewListInclude } from "./reviewListInclude";
import type { ReviewWithCall } from "./ReviewWithCall";

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

  async countByStatus(): Promise<ReviewCounts> {
    const groups = await this.prismaService.review.groupBy({ by: ["status"], _count: { _all: true } });
    const counts: ReviewCounts = { [ReviewStatus.open]: 0, [ReviewStatus.inProgress]: 0, [ReviewStatus.done]: 0 };
    groups.forEach((group) => {
      counts[group.status] = group._count._all;
    });
    return counts;
  }

  update(callId: string, changes: Prisma.ReviewUpdateInput): Promise<Review> {
    return this.prismaService.review.update({ where: { callId }, data: changes });
  }
}
