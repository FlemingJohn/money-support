import { Module } from "@nestjs/common";
import { APP_PIPE } from "@nestjs/core";
import { ScheduleModule } from "@nestjs/schedule";
import { ZodValidationPipe } from "nestjs-zod";
import { ActivityModule } from "./activity/ActivityModule";
import { AssistantModule } from "./assistant/AssistantModule";
import { CallbacksModule } from "./callbacks/CallbacksModule";
import { CallsModule } from "./calls/CallsModule";
import { CommonModule } from "./common/CommonModule";
import { ConfigurationModule } from "./configuration/ConfigurationModule";
import { FaqsModule } from "./faqs/FaqsModule";
import { GuardrailsModule } from "./guardrails/GuardrailsModule";
import { HealthModule } from "./health/HealthModule";
import { MaskingModule } from "./masking/MaskingModule";
import { OverviewModule } from "./overview/OverviewModule";
import { PrismaModule } from "./prisma/PrismaModule";
import { RetentionModule } from "./retention/RetentionModule";
import { ImprovementModule } from "./improvement/ImprovementModule";
import { ReportsModule } from "./reports/ReportsModule";
import { ReviewModule } from "./review/ReviewModule";
import { SettingsModule } from "./settings/SettingsModule";
import { VapiModule } from "./vapi/VapiModule";

@Module({
  imports: [
    ConfigurationModule,
    PrismaModule,
    CommonModule,
    ScheduleModule.forRoot(),
    ActivityModule,
    AssistantModule,
    GuardrailsModule,
    SettingsModule,
    FaqsModule,
    CallsModule,
    ReviewModule,
    VapiModule,
    CallbacksModule,
    OverviewModule,
    RetentionModule,
    HealthModule,
    MaskingModule,
    ReportsModule,
    ImprovementModule,
  ],
  providers: [{ provide: APP_PIPE, useClass: ZodValidationPipe }],
})
export class AppModule {}
