import { Module } from "@nestjs/common";
import { ActivityModule } from "../activity/ActivityModule";
import { AssistantModule } from "../assistant/AssistantModule";
import { FaqController } from "./controllers/FaqController";
import { FaqPresenter } from "./presenters/FaqPresenter";
import { FaqRepository } from "./repositories/FaqRepository";
import { FaqService } from "./services/FaqService";
import { InternalFaqController } from "./controllers/InternalFaqController";

@Module({
  imports: [ActivityModule, AssistantModule],
  controllers: [FaqController, InternalFaqController],
  providers: [FaqPresenter, FaqRepository, FaqService],
  exports: [FaqRepository],
})
export class FaqsModule {}
