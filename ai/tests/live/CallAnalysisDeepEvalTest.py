import asyncio
import json
import os

import pytest

os.environ.setdefault("DEEPEVAL_TELEMETRY_OPT_OUT", "YES")

from deepeval import assert_test
from deepeval.metrics import GEval
from deepeval.test_case import LLMTestCase, SingleTurnParams

from app.analysis.models.AnalysisRequest import AnalysisRequest
from app.analysis.models.CallLine import CallLine
from app.analysis.models.FaqSummary import FaqSummary
from tests.support.AnalysisSetup import AnalysisSetup
from tests.support.ExpectedValueMetric import ExpectedValueMetric
from tests.support.LiveSetup import LiveSetup
from tests.support.MaskingMetric import MaskingMetric
from tests.support.SampleData import SampleData

calls = json.loads((SampleData().make_configuration().project_folder / "evaluation" / "analysis" / "calls.json").read_text(encoding="utf-8"))
faqs = [
    FaqSummary(number=1, question="How do I check my transfer's status?"),
    FaqSummary(number=2, question="When will my money arrive?"),
    FaqSummary(number=3, question="Why does it say my transfer's complete when the money hasn't arrived yet?"),
    FaqSummary(number=4, question="Why is my transfer taking longer than the estimate?"),
    FaqSummary(number=5, question="What is a proof of payment?"),
    FaqSummary(number=6, question="What's a banking partner reference number?"),
]


@pytest.mark.live
class CallAnalysisDeepEvalTest:
    service = AnalysisSetup(LiveSetup().make_configuration(), LiveSetup().make_model()).make_service() if os.environ.get("AZURE_OPENAI_API_KEY") else None

    def analyse(self, call: dict):
        lines = [CallLine(position=index, speaker=speaker, text=text) for index, (speaker, text) in enumerate(call["lines"])]
        request = AnalysisRequest(call_id=call["id"], lines=lines, ended_reason=call["endedReason"], faqs=faqs, hand_off_sentence=SampleData.hand_off_sentence, caller_number=call.get("callerNumber", ""))
        return asyncio.run(self.service.analyse(request))

    @pytest.mark.parametrize("call", calls, ids=[call["id"] for call in calls])
    def test_analyses_a_whole_call(self, call: dict) -> None:
        response = self.analyse(call)
        expected = call["expected"]
        transcript = "\n".join(line.redacted_text for line in response.lines)
        actual = {
            "matchedFaqNumber": response.matched_faq_number,
            "isHandedOff": response.is_handed_off,
            "reviewReason": response.suggested_review.reason if response.suggested_review else None,
        }
        test_case = LLMTestCase(
            input="\n".join(text for _, text in call["lines"]),
            actual_output=response.summary or "",
            metadata={"hide": expected["hidden"], "keep": expected["kept"], "expected": expected, "actual": actual},
        )
        masking_case = LLMTestCase(input=test_case.input, actual_output=transcript, metadata=test_case.metadata)
        summary_quality = GEval(
            name="Summary quality",
            criteria="The actual output summarises the call in the input in two or three sentences: what the caller asked, what the agent said and whether the caller was handed off. It contains no names, card digits or other personal details.",
            evaluation_params=[SingleTurnParams.INPUT, SingleTurnParams.ACTUAL_OUTPUT],
            model=LiveSetup().make_judge(),
            threshold=0.6,
            async_mode=False,
        )
        assert_test(masking_case, [MaskingMetric()], run_async=False)
        assert_test(test_case, [ExpectedValueMetric("Matched FAQ", "matchedFaqNumber"), ExpectedValueMetric("Hand-off", "isHandedOff"), ExpectedValueMetric("Review reason", "reviewReason"), summary_quality], run_async=False)
        assert all(any(value in field.value for field in response.fields) for value in expected["fieldValues"])
