from typing import Literal

from app.common.models.CamelModel import CamelModel


class AgentSettings(CamelModel):
    assistant_name: str
    language: Literal["en"]
    greeting: str
    voice: Literal["Elliot", "Kylie", "Rohan"]
    longest_call_minutes: int
    silence_seconds: int
