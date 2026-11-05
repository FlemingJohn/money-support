import json

from app.handoff.models.HandOffArguments import HandOffArguments
from app.handoff.models.ToolCallResponse import ToolCallResponse
from app.handoff.models.ToolCallResult import ToolCallResult
from app.handoff.models.VapiToolCall import VapiToolCall
from app.handoff.models.VapiToolCallRequest import VapiToolCallRequest
from app.handoff.services.HandOffGraph import HandOffGraph


class HandOffToolService:
    tool_name = "handOffToHuman"
    rung_result = "The support team's phone is ringing and the call is logged for follow-up."
    not_rung_result = "The support team could not be rung, but the call is logged for follow-up."
    not_live_result = "Logged without ringing the team, because this is not a live call."

    def __init__(self, hand_off_graph: HandOffGraph) -> None:
        self.hand_off_graph = hand_off_graph

    async def handle(self, request: VapiToolCallRequest) -> ToolCallResponse:
        tool_calls = [tool_call for tool_call in request.message.tool_call_list if tool_call.function.name == self.tool_name]
        call_id = request.message.call.id if request.message.call else None
        results = [ToolCallResult(tool_call_id=tool_call.id, result=await self.hand_off(tool_call, call_id)) for tool_call in tool_calls]
        return ToolCallResponse(results=results)

    async def hand_off(self, tool_call: VapiToolCall, call_id: str | None) -> str:
        if call_id is None:
            return self.not_live_result
        arguments = self.read_arguments(tool_call)
        state = await self.hand_off_graph.run({"call_id": call_id, "reason": arguments.reason, "caller_need": arguments.caller_need})
        return self.rung_result if state.get("is_team_rung") else self.not_rung_result

    def read_arguments(self, tool_call: VapiToolCall) -> HandOffArguments:
        arguments = tool_call.function.arguments
        values = json.loads(arguments) if isinstance(arguments, str) and arguments.strip() else arguments
        return HandOffArguments.model_validate(values or {})
