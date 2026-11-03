import { Module } from "@nestjs/common";
import { ActivityModule } from "../activity/ActivityModule";
import { AppConfiguration } from "../configuration/services/AppConfiguration";
import { AiAssistantSyncClient } from "./clients/AiAssistantSyncClient";
import { AssistantSyncClient } from "./clients/AssistantSyncClient";
import { AssistantSyncService } from "./services/AssistantSyncService";
import { PromptVersionRepository } from "./repositories/PromptVersionRepository";
import { SkippedAssistantSyncClient } from "./clients/SkippedAssistantSyncClient";

@Module({
  imports: [ActivityModule],
  providers: [
    AssistantSyncService,
    PromptVersionRepository,
    {
      provide: AssistantSyncClient,
      inject: [AppConfiguration],
      useFactory: (appConfiguration: AppConfiguration) =>
        appConfiguration.isAiServiceConfigured ? new AiAssistantSyncClient(appConfiguration) : new SkippedAssistantSyncClient(),
    },
  ],
  exports: [AssistantSyncService, PromptVersionRepository],
})
export class AssistantModule {}
