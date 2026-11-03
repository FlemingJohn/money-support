from fastapi import APIRouter, Depends

from app.common.guards.ServiceSecretGuard import ServiceSecretGuard
from app.evaluation.models.EvaluationReport import EvaluationReport
from app.evaluation.services.EvaluationRunner import EvaluationRunner


class EvaluationRouter:
    def __init__(self, evaluation_runner: EvaluationRunner, service_secret_guard: ServiceSecretGuard) -> None:
        self.evaluation_runner = evaluation_runner
        self.service_secret_guard = service_secret_guard

    def make(self) -> APIRouter:
        router = APIRouter(prefix="/evaluations", tags=["evaluations"], dependencies=[Depends(self.service_secret_guard)])
        router.add_api_route("/run", self.run, methods=["POST"], response_model=EvaluationReport)
        return router

    async def run(self) -> EvaluationReport:
        return await self.evaluation_runner.run()
