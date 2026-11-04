from app.assistant.catalogs.HookCatalog import HookCatalog
from app.assistant.catalogs.ToolCatalog import ToolCatalog
from app.assistant.factories.CompliancePlanFactory import CompliancePlanFactory
from app.assistant.models.AssistantDraft import AssistantDraft
from app.assistant.services.AssistantConfigurationBuilder import AssistantConfigurationBuilder
from tests.support.SampleData import SampleData


class AssistantConfigurationBuilderTest:
    sample_data = SampleData()

    def build(self, mode: str = "endCall", **configuration_overrides: object) -> dict:
        configuration = self.sample_data.make_configuration(**configuration_overrides)
        builder = AssistantConfigurationBuilder(
            configuration,
            ToolCatalog(),
            HookCatalog(),
            CompliancePlanFactory(),
        )
        draft = AssistantDraft(
            faqs=self.sample_data.make_faqs(),
            settings=self.sample_data.make_settings(mode),
            prompt_content="prompt",
            prompt_hash="hash",
        )
        return builder.build(draft)

    def test_ends_the_call_on_the_hand_off_sentence(self) -> None:
        assistant = self.build()
        assert assistant["endCallPhrases"] == [self.sample_data.hand_off_sentence]
        assert [tool["type"] for tool in assistant["model"]["tools"]] == ["endCall"]
        assert assistant["model"]["tools"][0]["messages"][0]["content"] == "Thanks for calling Wise. Goodbye."

    def test_adds_the_transfer_tool_when_transferring(self) -> None:
        assistant = self.build("transfer")
        transfer_tool = assistant["model"]["tools"][1]
        assert assistant["endCallPhrases"] == []
        assert transfer_tool["destinations"][0]["number"] == "+447700900123"

    def test_keeps_recording_off_and_tags_the_assistant(self) -> None:
        assistant = self.build()
        assert assistant["artifactPlan"] == {"recordingEnabled": False}
        assert assistant["metadata"] == {"service": "money-support", "promptHash": "hash"}

    def test_adds_the_webhook_only_when_configured(self) -> None:
        assert "server" not in self.build()
        assistant = self.build(vapi_webhook_url="https://example.org/vapi/webhook", vapi_webhook_secret="hook")
        assert assistant["server"]["headers"] == {"x-vapi-secret": "hook"}
        assert assistant["serverMessages"] == ["status-update", "end-of-call-report"]

    def test_turns_off_vapi_analysis_and_number_filters(self) -> None:
        assistant = self.build()
        assert assistant["analysisPlan"] == {"summaryPlan": {"enabled": False}, "structuredDataPlan": {"enabled": False}}
        assert assistant["compliancePlan"]["securityFilterPlan"]["filters"] == [{"type": "prompt-injection"}]
