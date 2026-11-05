import { Module } from "@nestjs/common";
import { ActivityModule } from "../activity/ActivityModule";
import { CallsModule } from "../calls/CallsModule";
import { GuardrailsModule } from "../guardrails/GuardrailsModule";
import { ReviewTestsModule } from "../review-tests/ReviewTestsModule";
import { ReviewController } from "./controllers/ReviewController";
import { ReviewPresenter } from "./presenters/ReviewPresenter";
import { ReviewRepository } from "./repositories/ReviewRepository";
import { ReviewService } from "./services/ReviewService";
import { ReviewTriage } from "./services/ReviewTriage";

@Module({
  imports: [ActivityModule, CallsModule, GuardrailsModule, ReviewTestsModule],
  controllers: [ReviewController],
  providers: [ReviewPresenter, ReviewRepository, ReviewService, ReviewTriage],
  exports: [ReviewPresenter, ReviewRepository, ReviewTriage],
})
export class ReviewModule {}
