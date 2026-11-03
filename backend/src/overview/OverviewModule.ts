import { Module } from "@nestjs/common";
import { CallsModule } from "../calls/CallsModule";
import { ReviewModule } from "../review/ReviewModule";
import { CallStatistics } from "./services/CallStatistics";
import { DayRange } from "./services/DayRange";
import { OverviewController } from "./controllers/OverviewController";
import { OverviewService } from "./services/OverviewService";

@Module({
  imports: [CallsModule, ReviewModule],
  controllers: [OverviewController],
  providers: [CallStatistics, DayRange, OverviewService],
})
export class OverviewModule {}
