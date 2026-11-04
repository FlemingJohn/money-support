import operator
from typing import Annotated, TypedDict

from app.analysis.models.AnalysisRequest import AnalysisRequest
from app.analysis.models.CallChecks import CallChecks
from app.analysis.models.ExtractedField import ExtractedField
from app.analysis.models.MaskedLine import MaskedLine


class CallAnalysisState(TypedDict, total=False):
    request: AnalysisRequest
    masked_lines: Annotated[list[MaskedLine], operator.add]
    summary: str | None
    topic: str | None
    matched_faq_number: int | None
    fields: list[ExtractedField]
    checks: CallChecks | None
    failed_steps: Annotated[list[str], operator.add]
