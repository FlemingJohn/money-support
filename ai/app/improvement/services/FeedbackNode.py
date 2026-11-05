from langgraph.config import get_stream_writer

from app.backend.clients.BackendClient import BackendClient
from app.improvement.state.ImprovementState import ImprovementState


class FeedbackNode:
    def __init__(self, backend_client: BackendClient) -> None:
        self.backend_client = backend_client

    async def __call__(self, state: ImprovementState) -> dict:
        feedback = await self.backend_client.get_feedback()
        get_stream_writer()({"type": "step", "step": "feedback", "status": "done", "detail": f"{len(feedback)} failing test{'' if len(feedback) == 1 else 's'} from reviews"})
        return {"feedback": feedback}
