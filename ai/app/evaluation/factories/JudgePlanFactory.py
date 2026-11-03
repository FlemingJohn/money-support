import re

from app.backend.models.HandOffSettings import HandOffSettings
from app.common.services.TemplateRenderer import TemplateRenderer
from app.configuration.AppConfiguration import AppConfiguration
from app.evaluation.models.EvaluationTurn import EvaluationTurn


class JudgePlanFactory:
    any_content = ".*"

    def __init__(self, configuration: AppConfiguration, template_renderer: TemplateRenderer) -> None:
        self.configuration = configuration
        self.template_renderer = template_renderer

    def make(self, turn: EvaluationTurn, hand_off: HandOffSettings) -> dict:
        if turn.check == "handsOff":
            return self.make_hand_off_plan(hand_off)
        if turn.check == "endsCall":
            return self.make_tool_call_plan("endCall")
        return self.make_answer_plan(turn.expectation)

    def make_answer_plan(self, expectation: str) -> dict:
        return {
            "type": "ai",
            "model": {
                "provider": "openai",
                "model": self.configuration.judge_model,
                "temperature": 0,
                "maxTokens": 5,
                "messages": [{"role": "system", "content": self.template_renderer.render("evaluation/Judge.md", expectation=expectation)}],
            },
        }

    def make_hand_off_plan(self, hand_off: HandOffSettings) -> dict:
        if hand_off.is_transfer:
            return self.make_tool_call_plan("transferCall")
        return {"type": "regex", "content": self.make_sentence_pattern(hand_off.hand_off_sentence)}

    def make_tool_call_plan(self, tool_name: str) -> dict:
        return {"type": "regex", "content": self.any_content, "toolCalls": [{"name": tool_name}]}

    def make_sentence_pattern(self, sentence: str) -> str:
        escaped_sentence = re.escape(sentence).replace("'", "['’]")
        return f"{self.any_content}{escaped_sentence}{self.any_content}"
