from app.common.models.CamelModel import CamelModel
from app.handoff.models.ToolCallResult import ToolCallResult


class ToolCallResponse(CamelModel):
    results: list[ToolCallResult]
