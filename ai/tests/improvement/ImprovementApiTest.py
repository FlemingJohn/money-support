import json

from fastapi.testclient import TestClient

from app.ApplicationFactory import ApplicationFactory
from app.improvement.outputs.RuleProposalOutput import RuleProposalOutput
from app.ServiceContainer import ServiceContainer
from tests.support.FakeHttpServer import FakeHttpServer
from tests.support.SampleData import SampleData
from tests.support.ScriptedAnswers import ScriptedAnswers
from tests.support.ScriptedStructuredModel import ScriptedStructuredModel

sample_data = SampleData()
secret_header = {"x-service-secret": "secret"}
rule_text = "Fees, exchange rates and limits are never in scope, so hand off straight away."


class ImprovementApiTest:
    def make_client(self, feedback: list[dict], vapi: FakeHttpServer) -> TestClient:
        backend = FakeHttpServer(
            {
                ("GET", "/internal/faqs"): sample_data.make_faq_rows(),
                ("GET", "/internal/settings"): sample_data.make_settings_rows(),
                ("GET", "/internal/feedback"): feedback,
                ("GET", "/internal/prompt-rules"): [],
            }
        )
        answers = ScriptedAnswers().all() | {RuleProposalOutput: lambda text: RuleProposalOutput(rule_text=rule_text, explanation="Fixes the fees mistakes.")}
        container = ServiceContainer(sample_data.make_configuration(), backend.make_client("http://backend.test"), vapi.make_client("https://vapi.test"), ScriptedStructuredModel(answers))
        return TestClient(ApplicationFactory(container).make())

    def make_vapi(self) -> FakeHttpServer:
        return FakeHttpServer(
            {
                ("GET", "/assistant"): [{"id": "assistant-1", "name": "Money Support Agent", "metadata": {"service": "money-support"}}],
                ("POST", "/eval/run"): {"evalRunId": "run-1"},
                ("GET", "/eval/run/run-1"): {"id": "run-1", "status": "ended", "results": [{"status": "pass"}]},
            }
        )

    def test_tests_the_suggested_rule_on_a_copy_of_the_agent(self) -> None:
        vapi = self.make_vapi()
        feedback = [{"reviewCallId": "call-1", "callerLine": "What are your fees to India?", "reason": "shouldHaveHandedOff", "expectation": "Hand off."}]
        response = self.make_client(feedback, vapi).post("/improvements/suggest", headers=secret_header)
        body = response.json()
        assert response.status_code == 200
        assert body["ruleText"] == rule_text
        assert body["reviewCallIds"] == ["call-1"]
        trial_targets = [sent["target"] for sent in vapi.get_sent_bodies("POST", "/eval/run") if "assistant" in sent["target"]]
        live_targets = [sent["target"] for sent in vapi.get_sent_bodies("POST", "/eval/run") if "assistantId" in sent["target"]]
        assert trial_targets and live_targets
        assert rule_text in trial_targets[0]["assistant"]["model"]["messages"][0]["content"]

    def test_says_there_is_nothing_to_learn_without_wrong_verdicts(self) -> None:
        response = self.make_client([], self.make_vapi()).post("/improvements/suggest", headers=secret_header)
        assert response.status_code == 409

    def read_events(self, response) -> list[dict]:
        return [json.loads(line.removeprefix("data: ")) for line in response.text.splitlines() if line.startswith("data: ")]

    def test_streams_each_step_progress_and_the_result(self) -> None:
        feedback = [{"reviewCallId": "call-1", "callerLine": "What are your fees to India?", "reason": "shouldHaveHandedOff", "expectation": "Hand off."}]
        response = self.make_client(feedback, self.make_vapi()).post("/improvements/suggest/stream", headers=secret_header)
        events = self.read_events(response)
        assert response.headers["content-type"].startswith("text/event-stream")
        assert [event["step"] for event in events if event["type"] == "step" and event["status"] == "done"] == ["feedback", "rule", "tests"]
        progress = [event for event in events if event["type"] == "progress"]
        assert progress and progress[-1]["done"] == progress[-1]["total"]
        assert events[-1]["type"] == "result" and events[-1]["suggestion"]["ruleText"] == rule_text

    def test_streams_nothing_to_learn_without_wrong_verdicts(self) -> None:
        events = self.read_events(self.make_client([], self.make_vapi()).post("/improvements/suggest/stream", headers=secret_header))
        assert events[-1] == {"type": "nothing"}

