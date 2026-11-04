from pydantic import BaseModel


class FieldOutput(BaseModel):
    label: str
    value: str
    confidence: float
    line_position: int
