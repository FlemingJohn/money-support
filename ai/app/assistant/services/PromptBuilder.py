from app.backend.models.AssistantSettings import AssistantSettings
from app.backend.models.Faq import Faq
from app.common.services.TemplateRenderer import TemplateRenderer
from app.configuration.AppConfiguration import AppConfiguration


class PromptBuilder:
    def __init__(self, template_renderer: TemplateRenderer, configuration: AppConfiguration) -> None:
        self.template_renderer = template_renderer
        self.configuration = configuration

    def build(self, faqs: list[Faq], settings: AssistantSettings, learned_rules: list[str] | None = None) -> str:
        return self.template_renderer.render(
            "assistant/SystemPrompt.md",
            faqs=sorted(faqs, key=lambda faq: faq.number),
            agent=settings.agent,
            hand_off=settings.hand_off,
            uses_hand_off_tool=self.configuration.has_hand_off_tool and not settings.hand_off.is_transfer,
            learned_rules=learned_rules or [],
        )
