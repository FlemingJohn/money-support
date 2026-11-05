import asyncio

from app.analysis.outputs.MaskingOutput import MaskingOutput
from tests.support.AnalysisSetup import AnalysisSetup
from tests.support.SampleData import SampleData
from tests.support.ScriptedAnswers import ScriptedAnswers
from tests.support.ScriptedStructuredModel import ScriptedStructuredModel


class LineMaskerTest:
    def make_masker(self, answers: dict):
        return AnalysisSetup(SampleData().make_configuration(), ScriptedStructuredModel(answers)).make_line_masker()

    def test_masks_what_the_model_finds(self) -> None:
        masker = self.make_masker({MaskingOutput: ScriptedAnswers().masking})
        result = asyncio.run(masker.mask("Hi, this is Ananya", ["name"]))
        assert result.redacted_text == "Hi, this is [name removed]"
        assert result.is_checked

    def test_hides_the_line_when_the_model_fails(self) -> None:
        masker = self.make_masker({})
        result = asyncio.run(masker.mask("Hi, this is Ananya", ["name"]))
        assert result.redacted_text == "[waiting for privacy check]"
        assert not result.is_checked

    def test_skips_the_model_when_nothing_is_to_be_masked(self) -> None:
        model = ScriptedStructuredModel({})
        masker = AnalysisSetup(SampleData().make_configuration(), model).make_line_masker()
        result = asyncio.run(masker.mask("Hi, this is Ananya", []))
        assert result.redacted_text == "Hi, this is Ananya"
        assert model.questions == []

    def test_looks_harder_when_a_reviewer_reported_the_line(self) -> None:
        masker = self.make_masker({MaskingOutput: ScriptedAnswers().masking})
        assert "reported that this line still holds personal data" in masker.make_instructions(["name"], True)
        assert "reported that this line" not in masker.make_instructions(["name"], False)
