import { Module } from "@nestjs/common";
import { ActivityController } from "./ActivityController";
import { ActivityLog } from "./ActivityLog";
import { ActivityRepository } from "./ActivityRepository";

@Module({
  controllers: [ActivityController],
  providers: [ActivityLog, ActivityRepository],
  exports: [ActivityLog],
})
export class ActivityModule {}
