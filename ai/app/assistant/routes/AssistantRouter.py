from fastapi import APIRouter, Depends

from app.assistant.models.AssistantSyncResponse import AssistantSyncResponse
from app.assistant.services.AssistantSyncService import AssistantSyncService
from app.common.guards.ServiceSecretGuard import ServiceSecretGuard


class AssistantRouter:
    def __init__(self, assistant_sync_service: AssistantSyncService, service_secret_guard: ServiceSecretGuard) -> None:
        self.assistant_sync_service = assistant_sync_service
        self.service_secret_guard = service_secret_guard

    def make(self) -> APIRouter:
        router = APIRouter(prefix="/assistant", tags=["assistant"], dependencies=[Depends(self.service_secret_guard)])
        router.add_api_route("/sync", self.sync, methods=["POST"], response_model=AssistantSyncResponse)
        return router

    async def sync(self) -> AssistantSyncResponse:
        return await self.assistant_sync_service.sync()
