import { Module } from "@nestjs/common";
import { ActivityController } from "./controllers/ActivityController";
import { ActivityLog } from "./services/ActivityLog";
import { ActivityRepository } from "./repositories/ActivityRepository";

@Module({
  controllers: [ActivityController],
  providers: [ActivityLog, ActivityRepository],
  exports: [ActivityLog],
})
export class ActivityModule {}
