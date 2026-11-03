from pathlib import Path

from app.simulation.models.Scenario import Scenario


class ScenarioLoader:
    def __init__(self, scenarios_folder: Path) -> None:
        self.scenarios_folder = scenarios_folder

    def load_scenarios(self) -> list[Scenario]:
        return [self.load_scenario(path) for path in sorted(self.scenarios_folder.glob("*.json"))]

    def load_scenario(self, path: Path) -> Scenario:
        return Scenario.model_validate_json(path.read_text(encoding="utf-8"))
