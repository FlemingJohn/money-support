from typing import TypedDict


class HandOffState(TypedDict, total=False):
    call_id: str
    reason: str
    caller_need: str
    reason_description: str
    is_team_rung: bool
