from app.common.models.CamelModel import CamelModel
from app.guardrails.models.RedactionResult import RedactionResult


class RedactionResponse(CamelModel):
    results: list[RedactionResult]
