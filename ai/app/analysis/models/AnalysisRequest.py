from pydantic import Field

from app.analysis.catalogs.MaskKindCatalog import MaskKindCatalog
from app.analysis.models.CallLine import CallLine
from app.analysis.models.FaqSummary import FaqSummary
from app.common.models.CamelModel import CamelModel


class AnalysisRequest(CamelModel):
    call_id: str
    lines: list[CallLine] = Field(max_length=400)
    ended_reason: str | None = None
    mask_kinds: list[str] = Field(default_factory=lambda: MaskKindCatalog().all_labels)
    faqs: list[FaqSummary] = Field(default_factory=list)
    hand_off_sentence: str = ""
