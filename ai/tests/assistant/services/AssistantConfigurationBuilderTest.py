from app.assistant.catalogs.HookCatalog import HookCatalog
from app.assistant.catalogs.ToolCatalog import ToolCatalog
from app.assistant.factories.CompliancePlanFactory import CompliancePlanFactory
from app.assistant.factories.NoisePlanFactory import NoisePlanFactory
from app.assistant.factories.SpeakingPlanFactory import SpeakingPlanFactory
from app.assistant.factories.TranscriberFactory import TranscriberFactory
from app.assistant.factories.VoiceFactory import VoiceFactory
from app.assistant.models.AssistantDraft import AssistantDraft
from app.assistant.services.AssistantConfigurationBuilder import AssistantConfigurationBuilder
from app.common.services.TemplateRenderer import TemplateRenderer
from tests.support.SampleData import SampleData


class AssistantConfigurationBuilderTest:
    sample_data = SampleData()

    def build(self, mode: str = "endCall", **configuration_overrides: object) -> dict:
        configuration = self.sample_data.make_configuration(**configuration_overrides)
        builder = AssistantConfigurationBuilder(
            configuration,
            ToolCatalog(TemplateRenderer(configuration.prompts_folder)),
            HookCatalog(),
            CompliancePlanFactory(),
            VoiceFactory(),
            TranscriberFactory(),
            SpeakingPlanFactory(),
            NoisePlanFactory(),
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
        assert assistant["model"]["tools"][0]["messages"][0]["content"] == "Thanks for calling Wise. Take care."

    def test_adds_the_transfer_tool_when_transferring(self) -> None:
        assistant = self.build("transfer")
        transfer_tool = assistant["model"]["tools"][1]
        assert assistant["endCallPhrases"] == []
        assert transfer_tool["destinations"][0]["number"] == "+447700900123"
        assert transfer_tool["destinations"][0]["transferPlan"]["fallbackPlan"]["endCallEnabled"] is True
        assert "Hi, this is the Wise voice agent." in transfer_tool["destinations"][0]["transferPlan"]["summaryPlan"]["messages"][0]["content"]
        assert transfer_tool["destinations"][0]["message"] == ""

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

    def test_speaks_slower_and_listens_for_wise_terms(self) -> None:
        assistant = self.build()
        assert assistant["voice"] == {"provider": "vapi", "voiceId": "Elliot", "speed": 0.9}
        assert "bank account" in assistant["transcriber"]["keyterm"]

    def test_waits_for_the_caller_and_ignores_short_noises(self) -> None:
        assistant = self.build()
        assert assistant["startSpeakingPlan"]["smartEndpointingPlan"] == {"provider": "livekit"}
        assert assistant["stopSpeakingPlan"]["numWords"] == 2
        assert "hang on" in assistant["stopSpeakingPlan"]["interruptionPhrases"]

    def test_shares_the_prompt_cache_between_calls_with_the_same_prompt(self) -> None:
        assert self.build()["model"]["promptCacheKey"] == "money-support-hash"

    def test_removes_background_noise(self) -> None:
        assistant = self.build()
        assert assistant["backgroundSound"] == "off"
        assert assistant["backgroundSpeechDenoisingPlan"] == {"smartDenoisingPlan": {"enabled": True}}

    def test_only_ends_the_call_after_a_closing_question_or_a_goodbye(self) -> None:
        conditions = self.build()["model"]["tools"][0]["rejectionPlan"]["conditions"]
        assert [condition["target"]["role"] for condition in conditions] == ["assistant", "user"]
        assert all(condition["negate"] for condition in conditions)
