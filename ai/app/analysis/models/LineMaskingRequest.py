from pydantic import Field

from app.analysis.catalogs.MaskKindCatalog import MaskKindCatalog
from app.common.models.CamelModel import CamelModel


class LineMaskingRequest(CamelModel):
    text: str = Field(max_length=2000)
    mask_kinds: list[str] = Field(default_factory=lambda: MaskKindCatalog().all_labels)
