from app.common.services.TemplateRenderer import TemplateRenderer
from app.simulation.factories.SimulationEntryFactory import SimulationEntryFactory
from app.simulation.services.ScenarioLoader import ScenarioLoader
from tests.support.SampleData import SampleData


class SimulationEntryFactoryTest:
    configuration = SampleData().make_configuration()

    def make_entries(self) -> list[dict]:
        factory = SimulationEntryFactory(self.configuration, TemplateRenderer(self.configuration.prompts_folder))
        scenarios = ScenarioLoader(self.configuration.simulation_scenarios_folder).load_scenarios()
        return [factory.make(scenario) for scenario in scenarios]

    def test_turns_each_check_into_a_boolean_evaluation(self) -> None:
        evaluation = self.make_entries()[0]["scenario"]["evaluations"][0]
        assert evaluation["structuredOutput"]["schema"]["type"] == "boolean"
        assert evaluation["comparator"] == "="
        assert evaluation["value"] is True

    def test_mocks_the_transfer_tool(self) -> None:
        for entry in self.make_entries():
            assert entry["scenario"]["toolMocks"][0]["toolName"] == "transferCall"

    def test_gives_every_scenario_the_same_caller(self) -> None:
        personalities = {entry["personality"]["name"] for entry in self.make_entries()}
        assert personalities == {"Everyday caller"}
