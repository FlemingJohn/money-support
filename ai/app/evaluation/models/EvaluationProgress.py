from collections.abc import Awaitable, Callable
from dataclasses import dataclass

from app.evaluation.models.EvaluationCaseResult import EvaluationCaseResult


@dataclass(frozen=True)
class EvaluationProgress:
    on_start: Callable[[int], Awaitable[None]]
    on_result: Callable[[EvaluationCaseResult], Awaitable[None]]
