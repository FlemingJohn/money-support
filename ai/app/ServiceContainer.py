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
from app.analysis.services.OwnNumberMatcher import OwnNumberMatcher
from app.analysis.services.PieceMasker import PieceMasker
from app.analysis.services.ReviewSuggester import ReviewSuggester
from app.analysis.services.SummaryNode import SummaryNode
from app.analysis.services.TopicNode import TopicNode
from app.analysis.services.TranscriptFormatter import TranscriptFormatter
from app.assistant.catalogs.HookCatalog import HookCatalog
from app.assistant.catalogs.ToolCatalog import ToolCatalog
from app.assistant.clients.VapiAssistantClient import VapiAssistantClient
from app.assistant.factories.CompliancePlanFactory import CompliancePlanFactory
from app.assistant.factories.HandOffToolFactory import HandOffToolFactory
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
from app.common.guards.VapiSecretGuard import VapiSecretGuard
from app.common.services.RunPoller import RunPoller
from app.common.services.ServerSentEvents import ServerSentEvents
from app.common.services.TemplateRenderer import TemplateRenderer
from app.configuration.AppConfiguration import AppConfiguration
from app.evaluation.clients.VapiEvaluationClient import VapiEvaluationClient
from app.evaluation.factories.JudgePlanFactory import JudgePlanFactory
from app.evaluation.factories.MockConversationFactory import MockConversationFactory
from app.evaluation.routes.EvaluationRouter import EvaluationRouter
from app.evaluation.services.EvaluationCaseLoader import EvaluationCaseLoader
from app.evaluation.services.EvaluationRunner import EvaluationRunner
from app.evaluation.services.EvaluationStreamService import EvaluationStreamService
from app.handoff.catalogs.HandOffReasonCatalog import HandOffReasonCatalog
from app.handoff.routes.HandOffToolRouter import HandOffToolRouter
from app.handoff.services.HandOffGraph import HandOffGraph
from app.handoff.services.HandOffToolService import HandOffToolService
from app.handoff.services.ReasonNode import ReasonNode
from app.handoff.services.RingTeamNode import RingTeamNode
from app.health.routes.HealthRouter import HealthRouter
from app.improvement.routes.ImprovementRouter import ImprovementRouter
from app.improvement.services.FeedbackNode import FeedbackNode
from app.improvement.services.ImprovementGraph import ImprovementGraph
from app.improvement.services.ImprovementService import ImprovementService
from app.improvement.services.ProposeRuleNode import ProposeRuleNode
from app.improvement.services.TestRuleNode import TestRuleNode
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
            self.make_hand_off_tool_router(),
            self.make_improvement_router(),
        ]

    def make_improvement_router(self) -> APIRouter:
        configuration_builder = self.make_configuration_builder()
        sync_service = self.make_sync_service(configuration_builder)
        graph = ImprovementGraph(
            FeedbackNode(self.backend_client),
            ProposeRuleNode(self.structured_model, self.template_renderer),
            TestRuleNode(self.make_evaluation_runner(), sync_service, configuration_builder),
        )
        return ImprovementRouter(ImprovementService(graph, ServerSentEvents()), self.service_secret_guard).make()

    def make_hand_off_tool_router(self) -> APIRouter:
        graph = HandOffGraph(ReasonNode(HandOffReasonCatalog()), RingTeamNode(self.backend_client))
        return HandOffToolRouter(HandOffToolService(graph), VapiSecretGuard(self.configuration)).make()

    def make_assistant_router(self) -> APIRouter:
        return AssistantRouter(self.make_sync_service(self.make_configuration_builder()), self.service_secret_guard).make()

    def make_configuration_builder(self) -> AssistantConfigurationBuilder:
        return AssistantConfigurationBuilder(
            self.configuration,
            ToolCatalog(self.template_renderer, self.configuration, HandOffToolFactory(self.configuration, HandOffReasonCatalog())),
            HookCatalog(),
            CompliancePlanFactory(),
            VoiceFactory(),
            TranscriberFactory(),
            SpeakingPlanFactory(),
            NoisePlanFactory(),
        )

    def make_sync_service(self, configuration_builder: AssistantConfigurationBuilder) -> AssistantSyncService:
        return AssistantSyncService(self.backend_client, PromptBuilder(self.template_renderer, self.configuration), configuration_builder, self.assistant_client)

    def make_analysis_router(self) -> APIRouter:
        line_masker = LineMasker(self.structured_model, self.template_renderer, PieceMasker(MaskKindCatalog(), OwnNumberMatcher()), MaskKindCatalog())
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
        runner = self.make_evaluation_runner()
        return EvaluationRouter(runner, EvaluationStreamService(runner, ServerSentEvents()), self.service_secret_guard).make()

    def make_evaluation_runner(self) -> EvaluationRunner:
        return EvaluationRunner(
            EvaluationCaseLoader(self.configuration.evaluation_cases_folder),
            MockConversationFactory(JudgePlanFactory(self.configuration, self.template_renderer)),
            VapiEvaluationClient(self.vapi_client),
            self.assistant_client,
            self.backend_client,
            RunPoller(self.configuration),
        )

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
