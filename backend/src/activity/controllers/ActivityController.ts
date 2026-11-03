import { Controller, Get, Query } from "@nestjs/common";
import type { ActivityEvent } from "../../generated/prisma/client";
import { ActivityLog } from "../services/ActivityLog";
import { ActivityQueryDto } from "../dto/ActivityQueryDto";

@Controller("activity")
export class ActivityController {
  constructor(private readonly activityLog: ActivityLog) {}

  @Get()
  listRecent(@Query() query: ActivityQueryDto): Promise<ActivityEvent[]> {
    return this.activityLog.listRecent(query.limit);
  }
}
