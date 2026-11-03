from app.common.models.CamelModel import CamelModel


class SimulationRunStarted(CamelModel):
    run_id: str
    url: str
    scenario_count: int
