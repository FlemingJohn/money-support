import { Module } from "@nestjs/common";
import { ActivityModule } from "../activity/ActivityModule";
import { AssistantModule } from "../assistant/AssistantModule";
import { FaqController } from "./FaqController";
import { FaqPresenter } from "./FaqPresenter";
import { FaqRepository } from "./FaqRepository";
import { FaqService } from "./FaqService";
import { InternalFaqController } from "./InternalFaqController";

@Module({
  imports: [ActivityModule, AssistantModule],
  controllers: [FaqController, InternalFaqController],
  providers: [FaqPresenter, FaqRepository, FaqService],
  exports: [FaqRepository],
})
export class FaqsModule {}
