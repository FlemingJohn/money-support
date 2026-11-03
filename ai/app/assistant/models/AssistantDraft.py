from dataclasses import dataclass

from app.backend.models.AssistantSettings import AssistantSettings
from app.backend.models.Faq import Faq


@dataclass(frozen=True)
class AssistantDraft:
    faqs: list[Faq]
    settings: AssistantSettings
    prompt_content: str
    prompt_hash: str
