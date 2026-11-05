from pydantic import Field

from app.common.models.CamelModel import CamelModel
from app.handoff.models.VapiCallReference import VapiCallReference
from app.handoff.models.VapiToolCall import VapiToolCall


class VapiToolCallMessage(CamelModel):
    type: str
    tool_call_list: list[VapiToolCall] = Field(default_factory=list)
    call: VapiCallReference | None = None
