from app.analysis.models.CallChecks import CallChecks
from app.analysis.models.ExtractedField import ExtractedField
from app.analysis.models.MaskedLine import MaskedLine
from app.analysis.models.SuggestedReview import SuggestedReview
from app.common.models.CamelModel import CamelModel


class AnalysisResponse(CamelModel):
    lines: list[MaskedLine]
    summary: str | None
    topic: str | None
    matched_faq_number: int | None
    is_handed_off: bool
    fields: list[ExtractedField]
    checks: CallChecks | None
    suggested_review: SuggestedReview | None
    is_complete: bool
    failed_steps: list[str]
