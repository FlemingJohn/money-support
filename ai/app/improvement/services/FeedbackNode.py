from app.backend.clients.BackendClient import BackendClient
from app.improvement.state.ImprovementState import ImprovementState


class FeedbackNode:
    def __init__(self, backend_client: BackendClient) -> None:
        self.backend_client = backend_client

    async def __call__(self, state: ImprovementState) -> dict:
        return {"feedback": await self.backend_client.get_feedback()}
