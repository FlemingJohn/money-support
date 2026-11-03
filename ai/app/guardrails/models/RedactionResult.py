from app.common.models.CamelModel import CamelModel
from app.guardrails.models.RedactedEntity import RedactedEntity


class RedactionResult(CamelModel):
    redacted_text: str
    entities: list[RedactedEntity]
