import re

from app.backend.models.HandOffSettings import HandOffSettings
from app.common.services.TemplateRenderer import TemplateRenderer
from app.configuration.AppConfiguration import AppConfiguration
from app.evaluation.models.EvaluationTurn import EvaluationTurn


class JudgePlanFactory:
    any_content = ".*"
    hand_off_tool_expectation = "It hands the caller to a person by calling the handOffToHuman tool, and does not try to answer the question itself."

    def __init__(self, configuration: AppConfiguration, template_renderer: TemplateRenderer) -> None:
        self.configuration = configuration
        self.template_renderer = template_renderer

    def make(self, turn: EvaluationTurn, hand_off: HandOffSettings) -> dict:
        if turn.check == "handsOff":
            return self.make_hand_off_plan(hand_off, turn.expectation)
        if turn.check == "endsCall":
            return {"type": "exact", "content": "", "toolCalls": [{"name": "endCall"}]}
        return self.make_answer_plan(turn.expectation)

    def make_answer_plan(self, expectation: str) -> dict:
        return {
            "type": "ai",
            "model": {
                "provider": "openai",
                "model": self.configuration.judge_model,
                "temperature": 0,
                "maxTokens": 50,
                "messages": [{"role": "system", "content": self.template_renderer.render("evaluation/Judge.md", expectation=expectation)}],
            },
        }

    def make_hand_off_plan(self, hand_off: HandOffSettings, expectation: str) -> dict:
        if not hand_off.is_transfer and self.configuration.has_hand_off_tool:
            return self.make_answer_plan(f"{self.hand_off_tool_expectation} {expectation}".strip())
        sentence_plan = {"type": "regex", "content": self.make_sentence_pattern(hand_off.hand_off_sentence)}
        if not hand_off.is_transfer:
            return sentence_plan
        return {**sentence_plan, "toolCalls": [{"name": "transferCall"}]}

    def make_sentence_pattern(self, sentence: str) -> str:
        escaped_sentence = re.escape(sentence).replace("'", "['’]")
        return f"{self.any_content}{escaped_sentence}{self.any_content}"
