from app.backend.clients.BackendClient import BackendClient
from app.backend.exceptions.BackendRequestError import BackendRequestError
from app.handoff.state.HandOffState import HandOffState


class RingTeamNode:
    def __init__(self, backend_client: BackendClient) -> None:
        self.backend_client = backend_client

    async def __call__(self, state: HandOffState) -> dict:
        try:
            is_team_rung = await self.backend_client.ring_team(state["call_id"], state["reason_description"], state["caller_need"])
        except BackendRequestError:
            return {"is_team_rung": False}
        return {"is_team_rung": is_team_rung}
