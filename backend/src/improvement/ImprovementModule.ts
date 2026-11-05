import { Module } from "@nestjs/common";
import { ActivityModule } from "../activity/ActivityModule";
import { AssistantModule } from "../assistant/AssistantModule";
import { ReviewTestsModule } from "../review-tests/ReviewTestsModule";
import { AiImprovementClient } from "./clients/AiImprovementClient";
import { ImprovementController } from "./controllers/ImprovementController";
import { InternalImprovementController } from "./controllers/InternalImprovementController";
import { ImprovementPresenter } from "./presenters/ImprovementPresenter";
import { PromptRuleRepository } from "./repositories/PromptRuleRepository";
import { PromptSuggestionRepository } from "./repositories/PromptSuggestionRepository";
import { PromptRuleService } from "./services/PromptRuleService";
import { SuggestionDecisionService } from "./services/SuggestionDecisionService";
import { SuggestionService } from "./services/SuggestionService";

@Module({
  imports: [ActivityModule, AssistantModule, ReviewTestsModule],
  controllers: [ImprovementController, InternalImprovementController],
  providers: [AiImprovementClient, ImprovementPresenter, PromptRuleRepository, PromptRuleService, PromptSuggestionRepository, SuggestionDecisionService, SuggestionService],
})
export class ImprovementModule {}
