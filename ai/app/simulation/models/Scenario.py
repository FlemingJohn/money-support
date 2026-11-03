from app.common.models.CamelModel import CamelModel
from app.simulation.models.ScenarioCheck import ScenarioCheck


class Scenario(CamelModel):
    id: str
    name: str
    instructions: str
    checks: list[ScenarioCheck]
