import { Module } from "@nestjs/common";
import { ActivityModule } from "../activity/ActivityModule";
import { CallsModule } from "../calls/CallsModule";
import { AiTestRunClient } from "./clients/AiTestRunClient";
import { InternalReviewTestController } from "./controllers/InternalReviewTestController";
import { ReviewTestController } from "./controllers/ReviewTestController";
import { ReviewTestPresenter } from "./presenters/ReviewTestPresenter";
import { TestRunPresenter } from "./presenters/TestRunPresenter";
import { ReviewTestRepository } from "./repositories/ReviewTestRepository";
import { TestRunRepository } from "./repositories/TestRunRepository";
import { ReviewTestBuilder } from "./services/ReviewTestBuilder";
import { ReviewTestCaseBuilder } from "./services/ReviewTestCaseBuilder";
import { ReviewTestService } from "./services/ReviewTestService";
import { ReviewTestWriter } from "./services/ReviewTestWriter";
import { TestRunRecorder } from "./services/TestRunRecorder";

@Module({
  imports: [ActivityModule, CallsModule],
  controllers: [InternalReviewTestController, ReviewTestController],
  providers: [AiTestRunClient, ReviewTestBuilder, ReviewTestCaseBuilder, ReviewTestPresenter, ReviewTestRepository, ReviewTestService, ReviewTestWriter, TestRunPresenter, TestRunRecorder, TestRunRepository],
  exports: [ReviewTestRepository, ReviewTestService, ReviewTestWriter],
})
export class ReviewTestsModule {}
