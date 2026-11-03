from fastapi import APIRouter, Depends

from app.common.guards.ServiceSecretGuard import ServiceSecretGuard
from app.simulation.models.SimulationReport import SimulationReport
from app.simulation.models.SimulationRunStarted import SimulationRunStarted
from app.simulation.services.SimulationRunner import SimulationRunner


class SimulationRouter:
    def __init__(self, simulation_runner: SimulationRunner, service_secret_guard: ServiceSecretGuard) -> None:
        self.simulation_runner = simulation_runner
        self.service_secret_guard = service_secret_guard

    def make(self) -> APIRouter:
        router = APIRouter(prefix="/simulations", tags=["simulations"], dependencies=[Depends(self.service_secret_guard)])
        router.add_api_route("/run", self.start, methods=["POST"], response_model=SimulationRunStarted)
        router.add_api_route("/runs/{run_id}", self.get_report, methods=["GET"], response_model=SimulationReport)
        return router

    async def start(self) -> SimulationRunStarted:
        return await self.simulation_runner.start()

    async def get_report(self, run_id: str) -> SimulationReport:
        return await self.simulation_runner.get_report(run_id)
