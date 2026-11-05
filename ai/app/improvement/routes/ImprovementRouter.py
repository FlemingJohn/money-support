from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse

from app.common.guards.ServiceSecretGuard import ServiceSecretGuard
from app.improvement.models.SuggestionResponse import SuggestionResponse
from app.improvement.services.ImprovementService import ImprovementService


class ImprovementRouter:
    def __init__(self, improvement_service: ImprovementService, service_secret_guard: ServiceSecretGuard) -> None:
        self.improvement_service = improvement_service
        self.service_secret_guard = service_secret_guard

    def make(self) -> APIRouter:
        router = APIRouter(prefix="/improvements", tags=["improvements"], dependencies=[Depends(self.service_secret_guard)])
        router.add_api_route("/suggest", self.suggest, methods=["POST"], response_model=SuggestionResponse)
        router.add_api_route("/suggest/stream", self.suggest_streaming, methods=["POST"])
        return router

    async def suggest(self) -> SuggestionResponse:
        return await self.improvement_service.suggest()

    async def suggest_streaming(self) -> StreamingResponse:
        events = self.improvement_service.stream()
        return StreamingResponse(events, media_type=self.improvement_service.server_sent_events.media_type, headers=self.improvement_service.server_sent_events.headers)
