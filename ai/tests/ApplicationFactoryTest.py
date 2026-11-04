import pytest
from fastapi.testclient import TestClient
from presidio_analyzer import AnalyzerEngine

from app.ApplicationFactory import ApplicationFactory
from app.ServiceContainer import ServiceContainer
from app.guardrails.services.AnalyzerEngineFactory import AnalyzerEngineFactory
from tests.support.FakeHttpServer import FakeHttpServer
from tests.support.SampleData import SampleData

sample_data = SampleData()
secret_header = {"x-service-secret": "secret"}
our_assistant = {"id": "assistant-1", "name": "Money Support Agent", "metadata": {"service": "money-support"}}


@pytest.fixture(scope="module")
def analyzer() -> AnalyzerEngine:
    return AnalyzerEngineFactory().make()


class ApplicationFactoryTest:
    def make_client(self, analyzer: AnalyzerEngine, backend: FakeHttpServer, vapi: FakeHttpServer) -> TestClient:
        container = ServiceContainer(
            sample_data.make_configuration(),
            backend.make_client("http://backend.test"),
            vapi.make_client("https://vapi.test"),
            analyzer,
        )
        return TestClient(ApplicationFactory(container).make())

    def make_backend(self, faq_rows: list[dict] | None = None) -> FakeHttpServer:
        return FakeHttpServer(
            {
                ("GET", "/internal/faqs"): sample_data.make_faq_rows() if faq_rows is None else faq_rows,
                ("GET", "/internal/settings"): sample_data.make_settings_rows(),
            }
        )

    def test_health_needs_no_secret(self, analyzer: AnalyzerEngine) -> None:
        client = self.make_client(analyzer, self.make_backend(), FakeHttpServer({}))
        assert client.get("/health").json() == {"status": "ok"}

    def test_sync_needs_the_service_secret(self, analyzer: AnalyzerEngine) -> None:
        client = self.make_client(analyzer, self.make_backend(), FakeHttpServer({}))
        assert client.post("/assistant/sync").status_code == 401

    def test_sync_creates_the_assistant_when_none_exists(self, analyzer: AnalyzerEngine) -> None:
        vapi = FakeHttpServer({("GET", "/assistant"): [], ("POST", "/assistant"): our_assistant})
        response = self.make_client(analyzer, self.make_backend(), vapi).post("/assistant/sync", headers=secret_header)
        created = vapi.get_sent_bodies("POST", "/assistant")[0]
        assert response.status_code == 200
        assert len(response.json()["promptHash"]) == 64
        assert created["model"]["messages"][0]["content"] == response.json()["promptContent"]

    def test_sync_updates_our_existing_assistant(self, analyzer: AnalyzerEngine) -> None:
        other_assistant = {"id": "other", "name": "Razorpay Recover", "metadata": {}}
        vapi = FakeHttpServer({("GET", "/assistant"): [other_assistant, our_assistant], ("PATCH", "/assistant/assistant-1"): our_assistant})
        response = self.make_client(analyzer, self.make_backend(), vapi).post("/assistant/sync", headers=secret_header)
        assert response.status_code == 200
        assert len(vapi.get_sent_bodies("PATCH", "/assistant/assistant-1")) == 1
        assert vapi.get_sent_bodies("PATCH", "/assistant/other") == []

    def test_sync_refuses_without_active_faqs(self, analyzer: AnalyzerEngine) -> None:
        client = self.make_client(analyzer, self.make_backend(faq_rows=[]), FakeHttpServer({}))
        response = client.post("/assistant/sync", headers=secret_header)
        assert response.status_code == 409

    def test_sync_reports_an_unreachable_backend(self, analyzer: AnalyzerEngine) -> None:
        client = self.make_client(analyzer, FakeHttpServer({}), FakeHttpServer({}))
        assert client.post("/assistant/sync", headers=secret_header).status_code == 502

    def test_redact_keeps_one_result_per_text(self, analyzer: AnalyzerEngine) -> None:
        client = self.make_client(analyzer, self.make_backend(), FakeHttpServer({}))
        texts = ["My email is priya@example.com", "When will my money arrive?"]
        results = client.post("/guardrails/redact", json={"texts": texts}, headers=secret_header).json()["results"]
        assert results[0] == {"redactedText": "My email is [email address removed]", "entities": [{"entityType": "email address"}]}
        assert results[1] == {"redactedText": "When will my money arrive?", "entities": []}

    def test_evaluations_run_every_case(self, analyzer: AnalyzerEngine) -> None:
        vapi = FakeHttpServer(
            {
                ("GET", "/assistant"): [our_assistant],
                ("POST", "/eval/run"): {"evalRunId": "run-1"},
                ("GET", "/eval/run/run-1"): {"id": "run-1", "status": "ended", "endedReason": "mockConversation.done", "results": [{"status": "pass"}]},
            }
        )
        report = self.make_client(analyzer, self.make_backend(), vapi).post("/evaluations/run", headers=secret_header).json()
        assert report["passedCount"] == 12
        assert report["failedCount"] == 0
        assert vapi.get_sent_bodies("POST", "/eval/run")[0]["target"] == {"type": "assistant", "assistantId": "assistant-1"}

    def test_simulations_start_one_run_with_every_scenario(self, analyzer: AnalyzerEngine) -> None:
        vapi = FakeHttpServer(
            {
                ("GET", "/assistant"): [our_assistant],
                ("POST", "/eval/simulation/run"): {"id": "simulation-1", "url": "https://dashboard.vapi.ai/run", "status": "queued"},
            }
        )
        started = self.make_client(analyzer, self.make_backend(), vapi).post("/simulations/run", headers=secret_header).json()
        sent = vapi.get_sent_bodies("POST", "/eval/simulation/run")[0]
        assert started == {"runId": "simulation-1", "url": "https://dashboard.vapi.ai/run", "scenarioCount": 4}
        assert sent["transport"] == {"provider": "vapi.webchat"}

    def test_evaluations_need_a_synced_assistant(self, analyzer: AnalyzerEngine) -> None:
        vapi = FakeHttpServer({("GET", "/assistant"): []})
        response = self.make_client(analyzer, self.make_backend(), vapi).post("/evaluations/run", headers=secret_header)
        assert response.status_code == 409
