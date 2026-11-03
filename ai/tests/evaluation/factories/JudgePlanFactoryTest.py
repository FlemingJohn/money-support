import re

from app.common.services.TemplateRenderer import TemplateRenderer
from app.evaluation.factories.JudgePlanFactory import JudgePlanFactory
from app.evaluation.models.EvaluationTurn import EvaluationTurn
from tests.support.SampleData import SampleData


class JudgePlanFactoryTest:
    sample_data = SampleData()

    def make_factory(self) -> JudgePlanFactory:
        configuration = self.sample_data.make_configuration()
        return JudgePlanFactory(configuration, TemplateRenderer(configuration.prompts_folder))

    def test_matches_the_hand_off_sentence_with_either_apostrophe(self) -> None:
        plan = self.make_factory().make(EvaluationTurn(role="assistant", check="handsOff"), self.sample_data.make_settings().hand_off)
        curly_sentence = self.sample_data.hand_off_sentence.replace("'", "’")
        assert plan["type"] == "regex"
        assert re.fullmatch(plan["content"], self.sample_data.hand_off_sentence)
        assert re.fullmatch(plan["content"], f"Sorry. {curly_sentence}")

    def test_expects_the_transfer_tool_when_transferring(self) -> None:
        plan = self.make_factory().make(EvaluationTurn(role="assistant", check="handsOff"), self.sample_data.make_settings("transfer").hand_off)
        assert plan["toolCalls"] == [{"name": "transferCall"}]

    def test_expects_the_end_call_tool(self) -> None:
        plan = self.make_factory().make(EvaluationTurn(role="assistant", check="endsCall"), self.sample_data.make_settings().hand_off)
        assert plan["toolCalls"] == [{"name": "endCall"}]

    def test_asks_the_judge_about_the_expectation(self) -> None:
        turn = EvaluationTurn(role="assistant", check="answers", expectation="It explains the status.")
        plan = self.make_factory().make(turn, self.sample_data.make_settings().hand_off)
        judge_instructions = plan["model"]["messages"][0]["content"]
        assert plan["model"]["model"] == "gpt-4.1"
        assert "- It explains the status." in judge_instructions
        assert "{{messages[-1]}}" in judge_instructions
