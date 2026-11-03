from pydantic import Field

from app.common.models.CamelModel import CamelModel


class RedactionRequest(CamelModel):
    texts: list[str] = Field(max_length=2000)
