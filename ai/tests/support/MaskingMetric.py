from deepeval.metrics import BaseMetric
from deepeval.test_case import LLMTestCase


class MaskingMetric(BaseMetric):
    def __init__(self) -> None:
        self.threshold = 1.0

    def measure(self, test_case: LLMTestCase, *args, **kwargs) -> float:
        masked = test_case.actual_output.lower()
        hidden = test_case.metadata["hide"]
        kept = test_case.metadata["keep"]
        leaked = [piece for piece in hidden if piece.lower() in masked]
        lost = [piece for piece in kept if piece.lower() not in masked]
        self.score = 0.0 if leaked or lost else 1.0
        self.success = self.score >= self.threshold
        self.reason = "masked correctly" if self.success else f"leaked {leaked}, lost {lost}"
        return self.score

    async def a_measure(self, test_case: LLMTestCase, *args, **kwargs) -> float:
        return self.measure(test_case)

    def is_successful(self) -> bool:
        return bool(self.success)

    @property
    def __name__(self) -> str:
        return "Masking"
