import { Injectable } from "@nestjs/common";
import type { ActivityEvent } from "../generated/prisma/client";
import type { DatabaseTransaction } from "../prisma/types/DatabaseTransaction";
import type { ActivityEventInput } from "./ActivityEventInput";
import { ActivityRepository } from "./ActivityRepository";

@Injectable()
export class ActivityLog {
  constructor(private readonly activityRepository: ActivityRepository) {}

  async record(event: ActivityEventInput, transaction?: DatabaseTransaction): Promise<void> {
    await this.activityRepository.createEvent(event, transaction);
  }

  listRecent(limit: number): Promise<ActivityEvent[]> {
    return this.activityRepository.findRecent(limit);
  }
}
