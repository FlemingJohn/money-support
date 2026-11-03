import { Module } from "@nestjs/common";
import { ActivityModule } from "../activity/ActivityModule";
import { AssistantModule } from "../assistant/AssistantModule";
import { InternalSettingsController } from "./controllers/InternalSettingsController";
import { SettingsController } from "./controllers/SettingsController";
import { SettingsRepository } from "./repositories/SettingsRepository";
import { SettingsService } from "./services/SettingsService";

@Module({
  imports: [ActivityModule, AssistantModule],
  controllers: [SettingsController, InternalSettingsController],
  providers: [SettingsRepository, SettingsService],
  exports: [SettingsService],
})
export class SettingsModule {}
