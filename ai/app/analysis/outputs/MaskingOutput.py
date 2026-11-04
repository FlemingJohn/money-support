from pydantic import BaseModel

from app.analysis.outputs.MaskedPiece import MaskedPiece


class MaskingOutput(BaseModel):
    pieces: list[MaskedPiece]
