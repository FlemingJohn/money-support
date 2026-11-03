import { Module } from "@nestjs/common";
import { ActivityModule } from "../activity/ActivityModule";
import { AssistantModule } from "../assistant/AssistantModule";
import { SettingsController } from "./SettingsController";
import { SettingsRepository } from "./SettingsRepository";
import { SettingsService } from "./SettingsService";

@Module({
  imports: [ActivityModule, AssistantModule],
  controllers: [SettingsController],
  providers: [SettingsRepository, SettingsService],
  exports: [SettingsService],
})
export class SettingsModule {}
