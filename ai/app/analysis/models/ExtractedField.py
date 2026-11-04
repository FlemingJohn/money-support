from app.common.models.CamelModel import CamelModel


class ExtractedField(CamelModel):
    label: str
    value: str
    confidence: float
    line_position: int | None
