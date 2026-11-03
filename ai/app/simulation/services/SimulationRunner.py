from app.assistant.clients.VapiAssistantClient import VapiAssistantClient
from app.simulation.clients.VapiSimulationClient import VapiSimulationClient
from app.simulation.factories.SimulationEntryFactory import SimulationEntryFactory
from app.simulation.models.SimulationReport import SimulationReport
from app.simulation.models.SimulationRunStarted import SimulationRunStarted
from app.simulation.services.ScenarioLoader import ScenarioLoader


class SimulationRunner:
    def __init__(
        self,
        scenario_loader: ScenarioLoader,
        entry_factory: SimulationEntryFactory,
        simulation_client: VapiSimulationClient,
        assistant_client: VapiAssistantClient,
    ) -> None:
        self.scenario_loader = scenario_loader
        self.entry_factory = entry_factory
        self.simulation_client = simulation_client
        self.assistant_client = assistant_client

    async def start(self) -> SimulationRunStarted:
        assistant_id = await self.assistant_client.get_assistant_id()
        scenarios = self.scenario_loader.load_scenarios()
        entries = [self.entry_factory.make(scenario) for scenario in scenarios]
        started = await self.simulation_client.start_run(entries, assistant_id)
        return SimulationRunStarted(run_id=started["id"], url=started.get("url", ""), scenario_count=len(scenarios))

    async def get_report(self, run_id: str) -> SimulationReport:
        return SimulationReport.from_run(await self.simulation_client.get_run(run_id))
