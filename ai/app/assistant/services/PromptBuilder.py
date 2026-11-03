from app.backend.models.AssistantSettings import AssistantSettings
from app.backend.models.Faq import Faq
from app.common.services.TemplateRenderer import TemplateRenderer


class PromptBuilder:
    def __init__(self, template_renderer: TemplateRenderer) -> None:
        self.template_renderer = template_renderer

    def build(self, faqs: list[Faq], settings: AssistantSettings) -> str:
        return self.template_renderer.render(
            "assistant/SystemPrompt.md",
            faqs=sorted(faqs, key=lambda faq: faq.number),
            agent=settings.agent,
            hand_off=settings.hand_off,
        )
