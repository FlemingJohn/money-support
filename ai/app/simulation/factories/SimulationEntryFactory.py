from app.common.services.TemplateRenderer import TemplateRenderer
from app.configuration.AppConfiguration import AppConfiguration
from app.simulation.models.Scenario import Scenario
from app.simulation.models.ScenarioCheck import ScenarioCheck


class SimulationEntryFactory:
    def __init__(self, configuration: AppConfiguration, template_renderer: TemplateRenderer) -> None:
        self.configuration = configuration
        self.template_renderer = template_renderer

    def make(self, scenario: Scenario) -> dict:
        return {
            "type": "simulation",
            "name": f"{scenario.id} {scenario.name}",
            "scenario": self.make_scenario(scenario),
            "personality": self.make_personality(),
        }

    def make_scenario(self, scenario: Scenario) -> dict:
        return {
            "name": f"{scenario.id} {scenario.name}",
            "instructions": scenario.instructions,
            "evaluations": [self.make_evaluation(check) for check in scenario.checks],
            "toolMocks": [{"toolName": "transferCall", "result": "The caller is being transferred to the support team."}],
        }

    def make_evaluation(self, check: ScenarioCheck) -> dict:
        return {
            "structuredOutput": {"name": check.name, "type": "ai", "schema": {"type": "boolean", "description": check.question}},
            "comparator": "=",
            "value": check.expected,
            "required": True,
        }

    def make_personality(self) -> dict:
        return {
            "name": "Everyday caller",
            "assistant": {
                "model": {
                    "provider": "openai",
                    "model": self.configuration.assistant_model,
                    "messages": [{"role": "system", "content": self.template_renderer.render("simulation/Caller.md")}],
                }
            },
        }
