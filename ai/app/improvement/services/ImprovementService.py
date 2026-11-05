from collections.abc import AsyncIterator

from app.common.exceptions.ServiceError import ServiceError
from app.common.services.ServerSentEvents import ServerSentEvents
from app.improvement.exceptions.NoFeedbackError import NoFeedbackError
from app.improvement.models.SuggestionResponse import SuggestionResponse
from app.improvement.services.ImprovementGraph import ImprovementGraph
from app.improvement.state.ImprovementState import ImprovementState


class ImprovementService:
    def __init__(self, improvement_graph: ImprovementGraph, server_sent_events: ServerSentEvents) -> None:
        self.improvement_graph = improvement_graph
        self.server_sent_events = server_sent_events

    async def suggest(self) -> SuggestionResponse:
        state = await self.improvement_graph.run()
        if not state.get("feedback"):
            raise NoFeedbackError("There are no wrong verdicts waiting to be learned from")
        return self.to_response(state)

    async def stream(self) -> AsyncIterator[str]:
        state: ImprovementState = {}
        try:
            async for mode, chunk in self.improvement_graph.stream():
                if mode == "custom":
                    yield self.server_sent_events.format(chunk)
                else:
                    state = chunk
        except ServiceError as error:
            yield self.server_sent_events.format({"type": "error", "message": error.message})
            return
        if not state.get("feedback"):
            yield self.server_sent_events.format({"type": "nothing"})
            return
        yield self.server_sent_events.format({"type": "result", "suggestion": self.to_response(state).model_dump(by_alias=True)})

    def to_response(self, state: ImprovementState) -> SuggestionResponse:
        return SuggestionResponse(
            rule_text=state["rule_text"],
            explanation=state["explanation"],
            review_call_ids=sorted({item.review_call_id for item in state["feedback"]}),
            passed_before=state["passed_before"],
            passed_after=state["passed_after"],
            total_tests=state["total_tests"],
            is_better=state["passed_after"] > state["passed_before"],
        )
