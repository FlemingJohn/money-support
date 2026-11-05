import asyncio

from app.assistant.services.AssistantConfigurationBuilder import AssistantConfigurationBuilder
from app.assistant.services.AssistantSyncService import AssistantSyncService
from app.evaluation.services.EvaluationRunner import EvaluationRunner
from app.improvement.state.ImprovementState import ImprovementState


class TestRuleNode:
    def __init__(self, evaluation_runner: EvaluationRunner, sync_service: AssistantSyncService, configuration_builder: AssistantConfigurationBuilder) -> None:
        self.evaluation_runner = evaluation_runner
        self.sync_service = sync_service
        self.configuration_builder = configuration_builder

    async def __call__(self, state: ImprovementState) -> dict:
        draft = await self.sync_service.make_draft([state["rule_text"]])
        trial_target = {"type": "assistant", "assistant": self.configuration_builder.build(draft)}
        before, after = await asyncio.gather(self.evaluation_runner.run(), self.evaluation_runner.run(trial_target))
        return {"passed_before": before.passed_count, "passed_after": after.passed_count, "total_tests": len(after.results)}
