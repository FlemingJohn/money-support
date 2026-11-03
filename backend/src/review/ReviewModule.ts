import { Module } from "@nestjs/common";
import { ActivityModule } from "../activity/ActivityModule";
import { CallsModule } from "../calls/CallsModule";
import { GuardrailsModule } from "../guardrails/GuardrailsModule";
import { ReviewController } from "./ReviewController";
import { ReviewPresenter } from "./ReviewPresenter";
import { ReviewRepository } from "./ReviewRepository";
import { ReviewService } from "./ReviewService";
import { ReviewTriage } from "./ReviewTriage";
import { UnmaskedReportController } from "./UnmaskedReportController";
import { UnmaskedReportService } from "./UnmaskedReportService";

@Module({
  imports: [ActivityModule, CallsModule, GuardrailsModule],
  controllers: [ReviewController, UnmaskedReportController],
  providers: [ReviewPresenter, ReviewRepository, ReviewService, ReviewTriage, UnmaskedReportService],
  exports: [ReviewPresenter, ReviewRepository, ReviewTriage],
})
export class ReviewModule {}
