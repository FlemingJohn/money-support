from pydantic import BaseModel


class SummaryOutput(BaseModel):
    summary: str
