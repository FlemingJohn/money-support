from fastapi import APIRouter

from app.health.models.HealthResponse import HealthResponse


class HealthRouter:
    def make(self) -> APIRouter:
        router = APIRouter(tags=["health"])
        router.add_api_route("/health", self.get_health, methods=["GET"], response_model=HealthResponse)
        return router

    async def get_health(self) -> HealthResponse:
        return HealthResponse(status="ok")
