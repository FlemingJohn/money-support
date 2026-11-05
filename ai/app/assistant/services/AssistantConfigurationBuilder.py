from app.assistant.catalogs.HookCatalog import HookCatalog
from app.assistant.catalogs.ToolCatalog import ToolCatalog
from app.assistant.factories.CompliancePlanFactory import CompliancePlanFactory
from app.assistant.factories.NoisePlanFactory import NoisePlanFactory
from app.assistant.factories.SpeakingPlanFactory import SpeakingPlanFactory
from app.assistant.factories.TranscriberFactory import TranscriberFactory
from app.assistant.factories.VoiceFactory import VoiceFactory
from app.assistant.models.AssistantDraft import AssistantDraft
from app.configuration.AppConfiguration import AppConfiguration


class AssistantConfigurationBuilder:
    def __init__(
        self,
        configuration: AppConfiguration,
        tool_catalog: ToolCatalog,
        hook_catalog: HookCatalog,
        compliance_plan_factory: CompliancePlanFactory,
        voice_factory: VoiceFactory,
        transcriber_factory: TranscriberFactory,
        speaking_plan_factory: SpeakingPlanFactory,
        noise_plan_factory: NoisePlanFactory,
    ) -> None:
        self.configuration = configuration
        self.tool_catalog = tool_catalog
        self.hook_catalog = hook_catalog
        self.compliance_plan_factory = compliance_plan_factory
        self.voice_factory = voice_factory
        self.transcriber_factory = transcriber_factory
        self.speaking_plan_factory = speaking_plan_factory
        self.noise_plan_factory = noise_plan_factory

    def build(self, draft: AssistantDraft) -> dict:
        agent = draft.settings.agent
        return {
            "name": agent.assistant_name,
            "firstMessage": agent.greeting,
            "firstMessageMode": "assistant-speaks-first",
            "model": self.make_model(draft),
            "voice": self.voice_factory.make(agent),
            "transcriber": self.transcriber_factory.make(agent),
            "startSpeakingPlan": self.speaking_plan_factory.make_start_plan(),
            "stopSpeakingPlan": self.speaking_plan_factory.make_stop_plan(),
            "backgroundSound": "off",
            "backgroundSpeechDenoisingPlan": self.noise_plan_factory.make_denoising_plan(),
            "maxDurationSeconds": agent.longest_call_minutes * 60,
            "endCallPhrases": self.make_end_call_phrases(draft),
            "hooks": self.hook_catalog.make_hooks(agent),
            "compliancePlan": self.compliance_plan_factory.make(),
            "analysisPlan": {"summaryPlan": {"enabled": False}, "structuredDataPlan": {"enabled": False}},
            "artifactPlan": {"recordingEnabled": False},
            "metadata": {"service": self.configuration.assistant_tag, "promptHash": draft.prompt_hash},
            **self.make_server(),
        }

    def make_model(self, draft: AssistantDraft) -> dict:
        return {
            "provider": "openai",
            "model": self.configuration.assistant_model,
            "temperature": 0,
            "maxTokens": 250,
            "promptCacheKey": f"{self.configuration.assistant_tag}-{draft.prompt_hash[:16]}",
            "messages": [{"role": "system", "content": draft.prompt_content}],
            "tools": self.tool_catalog.make_tools(draft.settings.hand_off),
        }

    def make_end_call_phrases(self, draft: AssistantDraft) -> list[str]:
        hand_off = draft.settings.hand_off
        return [] if hand_off.is_transfer else [hand_off.hand_off_sentence]

    def make_server(self) -> dict:
        if not self.configuration.has_webhook:
            return {}
        return {
            "server": {
                "url": self.configuration.vapi_webhook_url,
                "headers": {"x-vapi-secret": self.configuration.vapi_webhook_secret},
                "timeoutSeconds": 60,
            },
            "serverMessages": ["status-update", "end-of-call-report"],
        }
