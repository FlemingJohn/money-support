import httpx
from fastapi import APIRouter

from app.analysis.catalogs.MaskKindCatalog import MaskKindCatalog
from app.analysis.clients.AzureStructuredModel import AzureStructuredModel
from app.analysis.clients.StructuredModel import StructuredModel
from app.analysis.routes.AnalysisRouter import AnalysisRouter
from app.analysis.services.CallAnalysisGraph import CallAnalysisGraph
from app.analysis.services.CallAnalysisService import CallAnalysisService
from app.analysis.services.CheckNode import CheckNode
from app.analysis.services.FieldsNode import FieldsNode
from app.analysis.services.HandOffDetector import HandOffDetector
from app.analysis.services.LineMasker import LineMasker
from app.analysis.services.LineMaskingNode import LineMaskingNode
from app.analysis.services.PieceMasker import PieceMasker
from app.analysis.services.ReviewSuggester import ReviewSuggester
from app.analysis.services.SummaryNode import SummaryNode
from app.analysis.services.TopicNode import TopicNode
from app.analysis.services.TranscriptFormatter import TranscriptFormatter
from app.assistant.catalogs.HookCatalog import HookCatalog
from app.assistant.catalogs.ToolCatalog import ToolCatalog
from app.assistant.clients.VapiAssistantClient import VapiAssistantClient
from app.assistant.factories.CompliancePlanFactory import CompliancePlanFactory
from app.assistant.factories.NoisePlanFactory import NoisePlanFactory
from app.assistant.factories.SpeakingPlanFactory import SpeakingPlanFactory
from app.assistant.factories.TranscriberFactory import TranscriberFactory
from app.assistant.factories.VoiceFactory import VoiceFactory
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
        structured_model: StructuredModel,
    ) -> None:
        self.configuration = configuration
        self.http_clients = [backend_http_client, vapi_http_client]
        self.structured_model = structured_model
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
        return cls(configuration, backend_http_client, vapi_http_client, AzureStructuredModel(configuration))

    def make_routers(self) -> list[APIRouter]:
        return [
            HealthRouter().make(),
            self.make_assistant_router(),
            self.make_analysis_router(),
            self.make_evaluation_router(),
            self.make_simulation_router(),
        ]

    def make_assistant_router(self) -> APIRouter:
        configuration_builder = AssistantConfigurationBuilder(
            self.configuration,
            ToolCatalog(),
            HookCatalog(),
            CompliancePlanFactory(),
            VoiceFactory(),
            TranscriberFactory(),
            SpeakingPlanFactory(),
            NoisePlanFactory(),
        )
        sync_service = AssistantSyncService(
            self.backend_client,
            PromptBuilder(self.template_renderer),
            configuration_builder,
            self.assistant_client,
        )
        return AssistantRouter(sync_service, self.service_secret_guard).make()

    def make_analysis_router(self) -> APIRouter:
        line_masker = LineMasker(self.structured_model, self.template_renderer, PieceMasker(MaskKindCatalog()), MaskKindCatalog())
        transcript_formatter = TranscriptFormatter()
        graph = CallAnalysisGraph(
            LineMaskingNode(line_masker),
            SummaryNode(self.structured_model, self.template_renderer, transcript_formatter),
            TopicNode(self.structured_model, self.template_renderer, transcript_formatter),
            FieldsNode(self.structured_model, self.template_renderer, transcript_formatter),
            CheckNode(self.structured_model, self.template_renderer, transcript_formatter),
        )
        call_analysis_service = CallAnalysisService(graph, HandOffDetector(), ReviewSuggester())
        return AnalysisRouter(call_analysis_service, line_masker, self.service_secret_guard).make()

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
