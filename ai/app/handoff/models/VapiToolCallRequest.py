from app.common.models.CamelModel import CamelModel
from app.handoff.models.VapiToolCallMessage import VapiToolCallMessage


class VapiToolCallRequest(CamelModel):
    message: VapiToolCallMessage
