from pydantic import BaseModel

from app.analysis.outputs.FieldOutput import FieldOutput


class FieldsOutput(BaseModel):
    fields: list[FieldOutput]
