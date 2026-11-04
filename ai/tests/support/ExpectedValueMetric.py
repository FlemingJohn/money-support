from deepeval.metrics import BaseMetric
from deepeval.test_case import LLMTestCase


class ExpectedValueMetric(BaseMetric):
    def __init__(self, name: str, key: str) -> None:
        self.metric_name = name
        self.key = key
        self.threshold = 1.0

    def measure(self, test_case: LLMTestCase, *args, **kwargs) -> float:
        expected = test_case.metadata["expected"][self.key]
        actual = test_case.metadata["actual"][self.key]
        self.score = 1.0 if expected == actual else 0.0
        self.success = self.score >= self.threshold
        self.reason = f"expected {expected!r}, got {actual!r}"
        return self.score

    async def a_measure(self, test_case: LLMTestCase, *args, **kwargs) -> float:
        return self.measure(test_case)

    def is_successful(self) -> bool:
        return bool(self.success)

    @property
    def __name__(self) -> str:
        return self.metric_name
