import { Module } from "@nestjs/common";
import { ActivityModule } from "../activity/ActivityModule";
import { AppConfiguration } from "../configuration/AppConfiguration";
import { AiAssistantSyncClient } from "./AiAssistantSyncClient";
import { AssistantSyncClient } from "./AssistantSyncClient";
import { AssistantSyncService } from "./AssistantSyncService";
import { PromptVersionRepository } from "./PromptVersionRepository";
import { SkippedAssistantSyncClient } from "./SkippedAssistantSyncClient";

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
