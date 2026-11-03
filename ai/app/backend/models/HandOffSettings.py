from typing import Literal

from app.common.models.CamelModel import CamelModel


class HandOffSettings(CamelModel):
    mode: Literal["endCall", "transfer"]
    hand_off_sentence: str
    transfer_number: str
    team_hours: Literal["weekdays", "always"]

    @property
    def is_transfer(self) -> bool:
        return self.mode == "transfer"
