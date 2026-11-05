from app.common.models.CamelModel import CamelModel
from app.handoff.models.VapiToolFunction import VapiToolFunction


class VapiToolCall(CamelModel):
    id: str
    function: VapiToolFunction
