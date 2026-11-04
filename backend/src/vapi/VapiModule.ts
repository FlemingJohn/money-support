import { Module } from "@nestjs/common";
import { ActivityModule } from "../activity/ActivityModule";
import { AssistantModule } from "../assistant/AssistantModule";
import { CallsModule } from "../calls/CallsModule";
import { FaqsModule } from "../faqs/FaqsModule";
import { GuardrailsModule } from "../guardrails/GuardrailsModule";
import { ReviewModule } from "../review/ReviewModule";
import { SettingsModule } from "../settings/SettingsModule";
import { CallCompletionBuilder } from "./services/CallCompletionBuilder";
import { CallRecordingService } from "./services/CallRecordingService";
import { EndOfCallReportHandler } from "./handlers/EndOfCallReportHandler";
import { FieldLocator } from "./services/FieldLocator";
import { FinishedCallWriter } from "./services/FinishedCallWriter";
import { ReportRedactor } from "./services/ReportRedactor";
import { StatusUpdateHandler } from "./handlers/StatusUpdateHandler";
import { StructuredDataReader } from "./services/StructuredDataReader";
import { VapiCallArchive } from "./clients/VapiCallArchive";
import { VapiReportReader } from "./services/VapiReportReader";
import { VapiWebhookController } from "./controllers/VapiWebhookController";
import { VapiWebhookService } from "./services/VapiWebhookService";

@Module({
  imports: [ActivityModule, AssistantModule, CallsModule, FaqsModule, GuardrailsModule, ReviewModule, SettingsModule],
  controllers: [VapiWebhookController],
  providers: [
    CallCompletionBuilder,
    CallRecordingService,
    EndOfCallReportHandler,
    FieldLocator,
    FinishedCallWriter,
    ReportRedactor,
    StatusUpdateHandler,
    StructuredDataReader,
    VapiCallArchive,
    VapiReportReader,
    VapiWebhookService,
  ],
})
export class VapiModule {}
