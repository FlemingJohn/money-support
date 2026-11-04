from app.common.models.CamelModel import CamelModel


class CallChecks(CamelModel):
    card_or_account_mentioned: bool
    hand_off_expected: bool
    agent_repeated_personal_data: bool
    possible_mistake: bool
    reason: str
