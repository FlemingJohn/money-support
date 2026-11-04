import asyncio
import json
import os

import pytest

os.environ.setdefault("DEEPEVAL_TELEMETRY_OPT_OUT", "YES")

from deepeval import assert_test
from deepeval.test_case import LLMTestCase

from tests.support.AnalysisSetup import AnalysisSetup
from tests.support.LiveSetup import LiveSetup
from tests.support.MaskingMetric import MaskingMetric
from tests.support.SampleData import SampleData

cases = json.loads((SampleData().make_configuration().project_folder / "evaluation" / "masking" / "cases.json").read_text(encoding="utf-8"))


@pytest.mark.live
class MaskingDeepEvalTest:
    line_masker = AnalysisSetup(LiveSetup().make_configuration(), LiveSetup().make_model()).make_line_masker() if os.environ.get("AZURE_OPENAI_API_KEY") else None

    @pytest.mark.parametrize("case", cases, ids=[case["text"][:40] for case in cases])
    def test_masks_personal_data_in_one_line(self, case: dict) -> None:
        result = asyncio.run(self.line_masker.mask(case["text"], ["name", "card number", "bank account number", "email address", "phone number", "address"]))
        test_case = LLMTestCase(input=case["text"], actual_output=result.redacted_text, metadata={"hide": case["hide"], "keep": case["keep"]})
        assert_test(test_case, [MaskingMetric()], run_async=False)
