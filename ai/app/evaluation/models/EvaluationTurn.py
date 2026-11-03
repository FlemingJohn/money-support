from typing import Literal

from app.common.models.CamelModel import CamelModel


class EvaluationTurn(CamelModel):
    role: Literal["user", "assistant"]
    content: str = ""
    check: Literal["answers", "handsOff", "endsCall"] | None = None
    expectation: str = ""

    @property
    def is_checked(self) -> bool:
        return self.check is not None
