import { Module } from "@nestjs/common";
import { CallsModule } from "../calls/CallsModule";
import { SettingsModule } from "../settings/SettingsModule";
import { RetentionJob } from "./RetentionJob";
import { RetentionService } from "./RetentionService";

@Module({
  imports: [CallsModule, SettingsModule],
  providers: [RetentionJob, RetentionService],
})
export class RetentionModule {}
