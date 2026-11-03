from app.backend.models.HandOffSettings import HandOffSettings
from app.evaluation.factories.JudgePlanFactory import JudgePlanFactory
from app.evaluation.models.EvaluationCase import EvaluationCase
from app.evaluation.models.EvaluationTurn import EvaluationTurn


class MockConversationFactory:
    def __init__(self, judge_plan_factory: JudgePlanFactory) -> None:
        self.judge_plan_factory = judge_plan_factory

    def make(self, case: EvaluationCase, hand_off: HandOffSettings) -> dict:
        return {
            "type": "chat.mockConversation",
            "name": f"{case.id} {case.name}",
            "messages": [self.make_message(turn, hand_off) for turn in case.turns],
        }

    def make_message(self, turn: EvaluationTurn, hand_off: HandOffSettings) -> dict:
        if not turn.is_checked:
            return {"role": turn.role, "content": turn.content}
        return {
            "role": "assistant",
            "judgePlan": self.judge_plan_factory.make(turn, hand_off),
            "continuePlan": {"exitOnFailureEnabled": True},
        }
