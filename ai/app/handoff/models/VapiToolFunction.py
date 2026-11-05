from pydantic import Field

from app.common.models.CamelModel import CamelModel


class VapiToolFunction(CamelModel):
    name: str
    arguments: dict | str = Field(default_factory=dict)
