from fastapi import APIRouter, Depends

from app.common.guards.VapiSecretGuard import VapiSecretGuard
from app.handoff.models.ToolCallResponse import ToolCallResponse
from app.handoff.models.VapiToolCallRequest import VapiToolCallRequest
from app.handoff.services.HandOffToolService import HandOffToolService


class HandOffToolRouter:
    def __init__(self, hand_off_tool_service: HandOffToolService, vapi_secret_guard: VapiSecretGuard) -> None:
        self.hand_off_tool_service = hand_off_tool_service
        self.vapi_secret_guard = vapi_secret_guard

    def make(self) -> APIRouter:
        router = APIRouter(prefix="/tools", tags=["tools"], dependencies=[Depends(self.vapi_secret_guard)])
        router.add_api_route("/hand-off", self.hand_off, methods=["POST"], response_model=ToolCallResponse)
        return router

    async def hand_off(self, request: VapiToolCallRequest) -> ToolCallResponse:
        return await self.hand_off_tool_service.handle(request)
