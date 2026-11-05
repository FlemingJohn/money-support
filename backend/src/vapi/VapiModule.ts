import { Module } from "@nestjs/common";
import { ActivityModule } from "../activity/ActivityModule";
import { AssistantModule } from "../assistant/AssistantModule";
import { CallsModule } from "../calls/CallsModule";
import { FaqsModule } from "../faqs/FaqsModule";
import { GuardrailsModule } from "../guardrails/GuardrailsModule";
import { HandOffEmailModule } from "../hand-off-email/HandOffEmailModule";
import { ReviewModule } from "../review/ReviewModule";
import { SettingsModule } from "../settings/SettingsModule";
import { CallCompletionBuilder } from "./services/CallCompletionBuilder";
import { CallRecordingService } from "./services/CallRecordingService";
import { EndOfCallReportHandler } from "./handlers/EndOfCallReportHandler";
import { FieldLocator } from "./services/FieldLocator";
import { HandOffToolReader } from "./services/HandOffToolReader";
import { FinishedCallWriter } from "./services/FinishedCallWriter";
import { AiCallAnalysisClient } from "./clients/AiCallAnalysisClient";
import { CallAnalysisClient } from "./clients/CallAnalysisClient";
import { PendingCallAnalysisClient } from "./clients/PendingCallAnalysisClient";
import { PendingAnalysisBuilder } from "./services/PendingAnalysisBuilder";
import { ReportAnalyser } from "./services/ReportAnalyser";
import { StatusUpdateHandler } from "./handlers/StatusUpdateHandler";
import { AppConfiguration } from "../configuration/services/AppConfiguration";
import { VapiCallArchive } from "./clients/VapiCallArchive";
import { VapiReportReader } from "./services/VapiReportReader";
import { VapiWebhookController } from "./controllers/VapiWebhookController";
import { VapiWebhookService } from "./services/VapiWebhookService";

@Module({
  imports: [ActivityModule, AssistantModule, CallsModule, FaqsModule, GuardrailsModule, HandOffEmailModule, ReviewModule, SettingsModule],
  controllers: [VapiWebhookController],
  providers: [
    CallCompletionBuilder,
    CallRecordingService,
    EndOfCallReportHandler,
    FieldLocator,
    FinishedCallWriter,
    HandOffToolReader,
    PendingAnalysisBuilder,
    ReportAnalyser,
    StatusUpdateHandler,
    VapiCallArchive,
    VapiReportReader,
    VapiWebhookService,
    {
      provide: CallAnalysisClient,
      inject: [AppConfiguration, PendingAnalysisBuilder],
      useFactory: (appConfiguration: AppConfiguration, pendingAnalysisBuilder: PendingAnalysisBuilder) =>
        appConfiguration.isAiServiceConfigured
          ? new AiCallAnalysisClient(appConfiguration, pendingAnalysisBuilder)
          : new PendingCallAnalysisClient(pendingAnalysisBuilder),
    },
  ],
})
export class VapiModule {}
