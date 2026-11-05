from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse

from app.common.guards.ServiceSecretGuard import ServiceSecretGuard
from app.evaluation.models.EvaluationReport import EvaluationReport
from app.evaluation.services.EvaluationRunner import EvaluationRunner
from app.evaluation.services.EvaluationStreamService import EvaluationStreamService


class EvaluationRouter:
    def __init__(self, evaluation_runner: EvaluationRunner, evaluation_stream_service: EvaluationStreamService, service_secret_guard: ServiceSecretGuard) -> None:
        self.evaluation_runner = evaluation_runner
        self.evaluation_stream_service = evaluation_stream_service
        self.service_secret_guard = service_secret_guard

    def make(self) -> APIRouter:
        router = APIRouter(prefix="/evaluations", tags=["evaluations"], dependencies=[Depends(self.service_secret_guard)])
        router.add_api_route("/run", self.run, methods=["POST"], response_model=EvaluationReport)
        router.add_api_route("/run/stream", self.run_streaming, methods=["POST"])
        return router

    async def run(self) -> EvaluationReport:
        return await self.evaluation_runner.run()

    async def run_streaming(self) -> StreamingResponse:
        events = self.evaluation_stream_service.stream()
        return StreamingResponse(events, media_type=self.evaluation_stream_service.server_sent_events.media_type, headers=self.evaluation_stream_service.server_sent_events.headers)
