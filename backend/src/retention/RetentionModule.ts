import { Module } from "@nestjs/common";
import { CallsModule } from "../calls/CallsModule";
import { SettingsModule } from "../settings/SettingsModule";
import { RetentionJob } from "./jobs/RetentionJob";
import { RetentionService } from "./services/RetentionService";

@Module({
  imports: [CallsModule, SettingsModule],
  providers: [RetentionJob, RetentionService],
})
export class RetentionModule {}
