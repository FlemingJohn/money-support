from app.common.models.CamelModel import CamelModel


class LineMaskingResponse(CamelModel):
    redacted_text: str
    removed_kinds: list[str]
    is_checked: bool
