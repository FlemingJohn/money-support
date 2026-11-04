from app.analysis.models.AnalysisRequest import AnalysisRequest
from app.analysis.models.AnalysisResponse import AnalysisResponse
from app.analysis.services.CallAnalysisGraph import CallAnalysisGraph
from app.analysis.services.HandOffDetector import HandOffDetector
from app.analysis.services.ReviewSuggester import ReviewSuggester


class CallAnalysisService:
    def __init__(self, graph: CallAnalysisGraph, hand_off_detector: HandOffDetector, review_suggester: ReviewSuggester) -> None:
        self.graph = graph
        self.hand_off_detector = hand_off_detector
        self.review_suggester = review_suggester

    async def analyse(self, request: AnalysisRequest) -> AnalysisResponse:
        state = await self.graph.run({"request": request, "masked_lines": [], "failed_steps": []})
        lines = sorted(state.get("masked_lines", []), key=lambda line: line.position)
        fields = state.get("fields", [])
        checks = state.get("checks")
        is_handed_off = self.hand_off_detector.is_handed_off(request)
        failed_steps = sorted(set(state.get("failed_steps", [])))
        return AnalysisResponse(
            lines=lines,
            summary=state.get("summary"),
            topic=state.get("topic"),
            matched_faq_number=state.get("matched_faq_number"),
            is_handed_off=is_handed_off,
            fields=fields,
            checks=checks,
            suggested_review=self.review_suggester.suggest(is_handed_off, lines, fields, checks),
            is_complete=not failed_steps,
            failed_steps=failed_steps,
        )
