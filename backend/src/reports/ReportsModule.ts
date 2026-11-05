import { Module } from "@nestjs/common";
import { ActivityModule } from "../activity/ActivityModule";
import { CallsModule } from "../calls/CallsModule";
import { FaqsModule } from "../faqs/FaqsModule";
import { GuardrailsModule } from "../guardrails/GuardrailsModule";
import { ReviewModule } from "../review/ReviewModule";
import { VapiModule } from "../vapi/VapiModule";
import { ReportedLineMasker } from "./clients/ReportedLineMasker";
import { UnmaskedReportController } from "./controllers/UnmaskedReportController";
import { MaskingMissRepository } from "./repositories/MaskingMissRepository";
import { CallReanalysisService } from "./services/CallReanalysisService";
import { ReportDecider } from "./services/ReportDecider";
import { UnmaskedReportService } from "./services/UnmaskedReportService";

@Module({
  imports: [ActivityModule, CallsModule, FaqsModule, GuardrailsModule, ReviewModule, VapiModule],
  controllers: [UnmaskedReportController],
  providers: [CallReanalysisService, MaskingMissRepository, ReportDecider, ReportedLineMasker, UnmaskedReportService],
})
export class ReportsModule {}
