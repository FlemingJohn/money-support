import { Injectable } from "@nestjs/common";
import { type Call, type CallChannel, CallStatus, type Prisma, ReviewStatus } from "../generated/prisma/client";
import type { DatabaseTransaction } from "../prisma/DatabaseTransaction";
import { PrismaService } from "../prisma/PrismaService";
import type { CallCompletion } from "./CallCompletion";
import { callDetailInclude } from "./callDetailInclude";
import type { CallFilterDto } from "./CallFilterDto";
import type { CallRows } from "./CallRows";
import type { CallWithDetails } from "./CallWithDetails";

@Injectable()
export class CallRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async recordStarted(callId: string, channel: CallChannel, startedAt: Date): Promise<void> {
    await this.prismaService.call.upsert({
      where: { id: callId },
      create: { id: callId, channel, startedAt },
      update: {},
    });
  }

  async completeCall(transaction: DatabaseTransaction, completion: CallCompletion): Promise<void> {
    const { callId, ...values } = completion;
    await transaction.call.upsert({
      where: { id: callId },
      create: { id: callId, ...values, status: CallStatus.ended },
      update: { ...values, status: CallStatus.ended },
    });
  }

  findById(callId: string): Promise<Call | null> {
    return this.prismaService.call.findUnique({ where: { id: callId } });
  }

  findDetail(callId: string): Promise<CallWithDetails | null> {
    return this.prismaService.call.findUnique({ where: { id: callId }, include: callDetailInclude });
  }

  async findPage(filter: CallFilterDto): Promise<CallRows> {
    const where = this.pageFilter(filter);
    const [calls, total] = await this.prismaService.$transaction([
      this.prismaService.call.findMany({
        where,
        orderBy: { endedAt: "desc" },
        skip: (filter.page - 1) * filter.pageSize,
        take: filter.pageSize,
      }),
      this.prismaService.call.count({ where }),
    ]);
    return { calls, total };
  }

  findEndedBetween(start: Date, end: Date): Promise<Call[]> {
    return this.prismaService.call.findMany({ where: { status: CallStatus.ended, endedAt: { gte: start, lt: end } } });
  }

  findRecent(limit: number): Promise<Call[]> {
    return this.prismaService.call.findMany({ where: { status: CallStatus.ended }, orderBy: { endedAt: "desc" }, take: limit });
  }

  async clearStoredNumbersForResolvedReviews(): Promise<number> {
    const result = await this.prismaService.call.updateMany({
      where: { encryptedCustomerNumber: { not: null }, review: { status: ReviewStatus.done } },
      data: { encryptedCustomerNumber: null },
    });
    return result.count;
  }

  async clearStoredNumbersEndedBefore(cutoff: Date): Promise<number> {
    const result = await this.prismaService.call.updateMany({
      where: { encryptedCustomerNumber: { not: null }, endedAt: { lt: cutoff } },
      data: { encryptedCustomerNumber: null },
    });
    return result.count;
  }

  private pageFilter(filter: CallFilterDto): Prisma.CallWhereInput {
    const searchFilter: Prisma.CallWhereInput = filter.search
      ? { OR: [{ topic: { contains: filter.search, mode: "insensitive" } }, { id: { contains: filter.search } }] }
      : {};
    return { status: CallStatus.ended, outcome: filter.outcome, ...searchFilter };
  }
}
