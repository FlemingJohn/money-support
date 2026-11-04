from typing import Literal

from app.common.models.CamelModel import CamelModel


class SuggestedReview(CamelModel):
    reason: Literal["handOff", "guardrail", "lowConfidence", "possibleMistake"]
    note: str
