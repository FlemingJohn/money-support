from pydantic import BaseModel


class CheckOutput(BaseModel):
    hand_off_expected: bool
    agent_repeated_personal_data: bool
    possible_mistake: bool
    reason: str
