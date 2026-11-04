from typing import Literal

from app.common.models.CamelModel import CamelModel


class MaskedLine(CamelModel):
    position: int
    speaker: Literal["agent", "caller"]
    redacted_text: str
    removed_kinds: list[str]
    is_checked: bool
