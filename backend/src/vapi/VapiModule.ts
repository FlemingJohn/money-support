import { Module } from "@nestjs/common";
import { ActivityModule } from "../activity/ActivityModule";
import { AssistantModule } from "../assistant/AssistantModule";
import { CallsModule } from "../calls/CallsModule";
import { FaqsModule } from "../faqs/FaqsModule";
import { GuardrailsModule } from "../guardrails/GuardrailsModule";
import { ReviewModule } from "../review/ReviewModule";
import { SettingsModule } from "../settings/SettingsModule";
import { CallCompletionBuilder } from "./CallCompletionBuilder";
import { CallRecordingService } from "./CallRecordingService";
import { EndOfCallReportHandler } from "./EndOfCallReportHandler";
import { FieldLocator } from "./FieldLocator";
import { FinishedCallWriter } from "./FinishedCallWriter";
import { ReportRedactor } from "./ReportRedactor";
import { StatusUpdateHandler } from "./StatusUpdateHandler";
import { VapiCallArchive } from "./VapiCallArchive";
import { VapiReportReader } from "./VapiReportReader";
import { VapiWebhookController } from "./VapiWebhookController";
import { VapiWebhookService } from "./VapiWebhookService";

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
    VapiCallArchive,
    VapiReportReader,
    VapiWebhookService,
  ],
})
export class VapiModule {}
