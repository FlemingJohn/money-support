from app.common.models.CamelModel import CamelModel


class ToolCallResult(CamelModel):
    tool_call_id: str
    result: str
