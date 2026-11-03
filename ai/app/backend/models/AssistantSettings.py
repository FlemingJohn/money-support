from app.backend.models.AgentSettings import AgentSettings
from app.backend.models.HandOffSettings import HandOffSettings
from app.backend.models.PrivacySettings import PrivacySettings
from app.common.models.CamelModel import CamelModel


class AssistantSettings(CamelModel):
    agent: AgentSettings
    hand_off: HandOffSettings
    privacy: PrivacySettings
