import asyncio

from app.assistant.clients.VapiAssistantClient import VapiAssistantClient
from app.backend.clients.BackendClient import BackendClient
from app.backend.exceptions.BackendRequestError import BackendRequestError
from app.backend.models.HandOffSettings import HandOffSettings
from app.common.exceptions.ServiceError import ServiceError
from app.common.services.RunPoller import RunPoller
from app.evaluation.clients.VapiEvaluationClient import VapiEvaluationClient
from app.evaluation.factories.MockConversationFactory import MockConversationFactory
from app.evaluation.models.EvaluationCase import EvaluationCase
from app.evaluation.models.EvaluationCaseResult import EvaluationCaseResult
from app.evaluation.models.EvaluationReport import EvaluationReport
from app.evaluation.services.EvaluationCaseLoader import EvaluationCaseLoader


class EvaluationRunner:
    def __init__(
        self,
        case_loader: EvaluationCaseLoader,
        mock_conversation_factory: MockConversationFactory,
        evaluation_client: VapiEvaluationClient,
        assistant_client: VapiAssistantClient,
        backend_client: BackendClient,
        run_poller: RunPoller,
    ) -> None:
        self.case_loader = case_loader
        self.mock_conversation_factory = mock_conversation_factory
        self.evaluation_client = evaluation_client
        self.assistant_client = assistant_client
        self.backend_client = backend_client
        self.run_poller = run_poller
        self.run_limit = asyncio.Semaphore(run_poller.configuration.max_concurrent_runs)

    async def run(self, target: dict | None = None) -> EvaluationReport:
        target = target or {"type": "assistant", "assistantId": await self.assistant_client.get_assistant_id()}
        settings = await self.backend_client.get_assistant_settings()
        cases = self.case_loader.load_cases() + await self.load_review_cases()
        results = await asyncio.gather(*[self.run_case(case, target, settings.hand_off) for case in cases])
        return EvaluationReport.from_results(list(results))

    async def load_review_cases(self) -> list[EvaluationCase]:
        try:
            return await self.backend_client.get_review_tests()
        except BackendRequestError:
            return []

    async def run_case(self, case: EvaluationCase, target: dict, hand_off: HandOffSettings) -> EvaluationCaseResult:
        async with self.run_limit:
            return await self.run_limited_case(case, target, hand_off)

    async def run_limited_case(self, case: EvaluationCase, target: dict, hand_off: HandOffSettings) -> EvaluationCaseResult:
        try:
            mock_conversation = self.mock_conversation_factory.make(case, hand_off)
            run_id = await self.evaluation_client.start_run(mock_conversation, target)
            run = await self.run_poller.wait_until_ended(lambda: self.evaluation_client.get_run(run_id))
            return self.read_result(case, run)
        except ServiceError as error:
            return EvaluationCaseResult(case_id=case.id, name=case.name, status="error", detail=error.message)

    def read_result(self, case: EvaluationCase, run: dict) -> EvaluationCaseResult:
        results = run.get("results") or []
        has_passed = len(results) > 0 and all(result.get("status") == "pass" for result in results)
        detail = run.get("endedMessage") or run.get("endedReason") or ""
        return EvaluationCaseResult(case_id=case.id, name=case.name, status="passed" if has_passed else "failed", detail=detail)
