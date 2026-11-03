from typing import Literal

from app.common.models.CamelModel import CamelModel


class EvaluationCaseResult(CamelModel):
    case_id: str
    name: str
    status: Literal["passed", "failed", "error"]
    detail: str
