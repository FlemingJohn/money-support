from app.improvement.exceptions.NoFeedbackError import NoFeedbackError
from app.improvement.models.SuggestionResponse import SuggestionResponse
from app.improvement.services.ImprovementGraph import ImprovementGraph


class ImprovementService:
    def __init__(self, improvement_graph: ImprovementGraph) -> None:
        self.improvement_graph = improvement_graph

    async def suggest(self) -> SuggestionResponse:
        state = await self.improvement_graph.run()
        if not state.get("feedback"):
            raise NoFeedbackError("There are no wrong verdicts waiting to be learned from")
        passed_before, passed_after = state["passed_before"], state["passed_after"]
        return SuggestionResponse(
            rule_text=state["rule_text"],
            explanation=state["explanation"],
            review_call_ids=sorted({item.review_call_id for item in state["feedback"]}),
            passed_before=passed_before,
            passed_after=passed_after,
            total_tests=state["total_tests"],
            is_better=passed_after > passed_before,
        )
