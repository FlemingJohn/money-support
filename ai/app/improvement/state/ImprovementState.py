from typing import TypedDict

from app.improvement.models.FeedbackItem import FeedbackItem


class ImprovementState(TypedDict, total=False):
    feedback: list[FeedbackItem]
    rule_text: str
    explanation: str
    passed_before: int
    passed_after: int
    total_tests: int
