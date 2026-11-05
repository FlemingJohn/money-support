import { Module } from "@nestjs/common";
import { CallsModule } from "../calls/CallsModule";
import { ReviewModule } from "../review/ReviewModule";
import { CallStatistics } from "./services/CallStatistics";
import { OverviewController } from "./controllers/OverviewController";
import { OverviewService } from "./services/OverviewService";
import { PeriodRange } from "./services/PeriodRange";
import { QualityStatistics } from "./services/QualityStatistics";
import { UkTime } from "./services/UkTime";

@Module({
  imports: [CallsModule, ReviewModule],
  controllers: [OverviewController],
  providers: [CallStatistics, OverviewService, PeriodRange, QualityStatistics, UkTime],
})
export class OverviewModule {}
