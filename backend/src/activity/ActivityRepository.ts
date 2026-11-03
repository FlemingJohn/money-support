import { Injectable } from "@nestjs/common";
import type { ActivityEvent } from "../generated/prisma/client";
import type { DatabaseTransaction } from "../prisma/types/DatabaseTransaction";
import { PrismaService } from "../prisma/services/PrismaService";
import type { ActivityEventInput } from "./ActivityEventInput";

@Injectable()
export class ActivityRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createEvent(event: ActivityEventInput, transaction: DatabaseTransaction = this.prismaService): Promise<void> {
    await transaction.activityEvent.create({ data: event });
  }

  findRecent(limit: number): Promise<ActivityEvent[]> {
    return this.prismaService.activityEvent.findMany({ orderBy: { createdAt: "desc" }, take: limit });
  }
}
