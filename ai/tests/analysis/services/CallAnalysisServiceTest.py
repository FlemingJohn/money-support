import asyncio

from app.analysis.models.AnalysisRequest import AnalysisRequest
from app.analysis.models.CallLine import CallLine
from app.analysis.models.FaqSummary import FaqSummary
from app.analysis.outputs.MaskingOutput import MaskingOutput
from app.analysis.outputs.TopicOutput import TopicOutput
from tests.support.AnalysisSetup import AnalysisSetup
from tests.support.SampleData import SampleData
from tests.support.ScriptedAnswers import ScriptedAnswers
from tests.support.ScriptedStructuredModel import ScriptedStructuredModel


class CallAnalysisServiceTest:
    sample_data = SampleData()

    def make_request(self, ended_reason: str = "assistant-ended-call") -> AnalysisRequest:
        return AnalysisRequest(
            call_id="call-1",
            ended_reason=ended_reason,
            hand_off_sentence=self.sample_data.hand_off_sentence,
            faqs=[FaqSummary(number=1, question="How do I check my transfer's status?"), FaqSummary(number=2, question="When will my money arrive?")],
            lines=[
                CallLine(position=0, speaker="agent", text="Hi, how can I help?"),
                CallLine(position=1, speaker="caller", text="This is Ananya, I sent 800 euros, card 4 5 5 0"),
                CallLine(position=2, speaker="agent", text="I don't need your card number."),
            ],
        )

    def analyse(self, answers: dict, request: AnalysisRequest | None = None):
        model = ScriptedStructuredModel(answers)
        service = AnalysisSetup(self.sample_data.make_configuration(), model).make_service()
        return asyncio.run(service.analyse(request or self.make_request())), model

    def test_masks_every_line_before_the_other_steps(self) -> None:
        response, model = self.analyse(ScriptedAnswers().all())
        assert [line.redacted_text for line in response.lines][1] == "This is [name removed], I sent 800 euros, card [card number removed]"
        later_texts = [text for output_type, text in model.questions if output_type is not MaskingOutput]
        assert later_texts and all("Ananya" not in text and "4 5 5 0" not in text for text in later_texts)

    def test_fills_in_topic_faq_fields_and_summary(self) -> None:
        response, _ = self.analyse(ScriptedAnswers().all())
        assert response.topic == "Transfer not arrived"
        assert response.matched_faq_number == 2
        assert response.fields[0].value == "800 euros"
        assert response.fields[0].line_position == 1
        assert response.summary
        assert response.is_complete

    def test_suggests_a_review_when_personal_data_was_removed(self) -> None:
        response, _ = self.analyse(ScriptedAnswers().all())
        assert response.checks.card_or_account_mentioned
        assert response.suggested_review.reason == "guardrail"

    def test_drops_a_faq_number_that_does_not_exist(self) -> None:
        answers = ScriptedAnswers().all() | {TopicOutput: lambda text: TopicOutput(topic="Fees", matched_faq_number=9)}
        response, _ = self.analyse(answers)
        assert response.matched_faq_number is None

    def test_reports_a_failed_step_and_keeps_the_rest(self) -> None:
        answers = ScriptedAnswers().all()
        del answers[TopicOutput]
        response, _ = self.analyse(answers)
        assert response.topic is None
        assert response.summary
        assert response.failed_steps == ["classify_topic"]
        assert not response.is_complete

    def test_reads_a_hand_off_from_the_ended_reason(self) -> None:
        response, _ = self.analyse(ScriptedAnswers().all(), self.make_request("assistant-said-end-call-phrase"))
        assert response.is_handed_off
        assert response.suggested_review.reason == "handOff"

    def test_keeps_the_saved_lines_when_reanalysing_without_masking(self) -> None:
        request = self.make_request().model_copy(update={"mask_lines": False})
        response, model = self.analyse(ScriptedAnswers().all(), request)
        assert [line.redacted_text for line in response.lines] == [line.text for line in request.lines]
        assert all(output_type is not MaskingOutput for output_type, _ in model.questions)
        assert response.summary
