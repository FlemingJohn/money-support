from typing import Literal

from pydantic import BaseModel


class MaskedPiece(BaseModel):
    text: str
    kind: Literal["name", "card", "account", "email", "phone", "address"]
