import httpx
from fastapi import APIRouter
from presidio_analyzer import AnalyzerEngine
from presidio_anonymizer import AnonymizerEngine

from app.assistant.catalogs.HookCatalog import HookCatalog
from app.assistant.catalogs.ToolCatalog import ToolCatalog
from app.assistant.clients.VapiAssistantClient import VapiAssistantClient
from app.assistant.factories.AnalysisPlanFactory import AnalysisPlanFactory
from app.assistant.factories.CompliancePlanFactory import CompliancePlanFactory
from app.assistant.routes.AssistantRouter import AssistantRouter
from app.assistant.services.AssistantConfigurationBuilder import AssistantConfigurationBuilder
from app.assistant.services.AssistantSyncService import AssistantSyncService
from app.assistant.services.PromptBuilder import PromptBuilder
from app.backend.clients.BackendClient import BackendClient
from app.common.guards.ServiceSecretGuard import ServiceSecretGuard
from app.common.services.RunPoller import RunPoller
from app.common.services.TemplateRenderer import TemplateRenderer
from app.configuration.AppConfiguration import AppConfiguration
from app.evaluation.clients.VapiEvaluationClient import VapiEvaluationClient
from app.evaluation.factories.JudgePlanFactory import JudgePlanFactory
from app.evaluation.factories.MockConversationFactory import MockConversationFactory
from app.evaluation.routes.EvaluationRouter import EvaluationRouter
from app.evaluation.services.EvaluationCaseLoader import EvaluationCaseLoader
from app.evaluation.services.EvaluationRunner import EvaluationRunner
from app.guardrails.catalogs.CommonWordCatalog import CommonWordCatalog
from app.guardrails.catalogs.EntityLabelCatalog import EntityLabelCatalog
from app.guardrails.routes.GuardrailRouter import GuardrailRouter
from app.guardrails.services.AnalyzerEngineFactory import AnalyzerEngineFactory
from app.guardrails.services.PersonalDataRedactor import PersonalDataRedactor
from app.health.routes.HealthRouter import HealthRouter
from app.simulation.clients.VapiSimulationClient import VapiSimulationClient
from app.simulation.factories.SimulationEntryFactory import SimulationEntryFactory
from app.simulation.routes.SimulationRouter import SimulationRouter
from app.simulation.services.ScenarioLoader import ScenarioLoader
from app.simulation.services.SimulationRunner import SimulationRunner
from app.vapi.clients.VapiClient import VapiClient


class ServiceContainer:
    def __init__(
        self,
        configuration: AppConfiguration,
        backend_http_client: httpx.AsyncClient,
        vapi_http_client: httpx.AsyncClient,
        analyzer: AnalyzerEngine,
    ) -> None:
        self.configuration = configuration
        self.http_clients = [backend_http_client, vapi_http_client]
        self.analyzer = analyzer
        self.template_renderer = TemplateRenderer(configuration.prompts_folder)
        self.service_secret_guard = ServiceSecretGuard(configuration)
        self.backend_client = BackendClient(backend_http_client)
        self.vapi_client = VapiClient(vapi_http_client)
        self.assistant_client = VapiAssistantClient(configuration, self.vapi_client)

    @classmethod
    def from_configuration(cls, configuration: AppConfiguration) -> "ServiceContainer":
        backend_http_client = httpx.AsyncClient(
            base_url=configuration.backend_url,
            headers={"x-service-secret": configuration.service_secret},
            timeout=10,
        )
        vapi_http_client = httpx.AsyncClient(
            base_url=configuration.vapi_base_url,
            headers={"Authorization": f"Bearer {configuration.vapi_api_key}"},
            timeout=20,
        )
        return cls(configuration, backend_http_client, vapi_http_client, AnalyzerEngineFactory().make())

    def make_routers(self) -> list[APIRouter]:
        return [
            HealthRouter().make(),
            self.make_assistant_router(),
            self.make_guardrail_router(),
            self.make_evaluation_router(),
            self.make_simulation_router(),
        ]

    def make_assistant_router(self) -> APIRouter:
        configuration_builder = AssistantConfigurationBuilder(
            self.configuration,
            ToolCatalog(),
            HookCatalog(),
            CompliancePlanFactory(),
            AnalysisPlanFactory(self.template_renderer),
        )
        sync_service = AssistantSyncService(
            self.backend_client,
            PromptBuilder(self.template_renderer),
            configuration_builder,
            self.assistant_client,
        )
        return AssistantRouter(sync_service, self.service_secret_guard).make()

    def make_guardrail_router(self) -> APIRouter:
        redactor = PersonalDataRedactor(self.analyzer, AnonymizerEngine(), EntityLabelCatalog(), CommonWordCatalog())
        return GuardrailRouter(redactor, self.service_secret_guard).make()

    def make_evaluation_router(self) -> APIRouter:
        runner = EvaluationRunner(
            EvaluationCaseLoader(self.configuration.evaluation_cases_folder),
            MockConversationFactory(JudgePlanFactory(self.configuration, self.template_renderer)),
            VapiEvaluationClient(self.vapi_client),
            self.assistant_client,
            self.backend_client,
            RunPoller(self.configuration),
        )
        return EvaluationRouter(runner, self.service_secret_guard).make()

    def make_simulation_router(self) -> APIRouter:
        runner = SimulationRunner(
            ScenarioLoader(self.configuration.simulation_scenarios_folder),
            SimulationEntryFactory(self.configuration, self.template_renderer),
            VapiSimulationClient(self.vapi_client),
            self.assistant_client,
        )
        return SimulationRouter(runner, self.service_secret_guard).make()

    async def close(self) -> None:
        for http_client in self.http_clients:
            await http_client.aclose()
