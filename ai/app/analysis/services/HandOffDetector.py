import re

from app.analysis.models.AnalysisRequest import AnalysisRequest


class HandOffDetector:
    hand_off_reasons = {"assistant-said-end-call-phrase", "assistant-forwarded-call"}

    def is_handed_off(self, request: AnalysisRequest) -> bool:
        if request.ended_reason in self.hand_off_reasons:
            return True
        sentence = self.simplify(request.hand_off_sentence)
        return bool(sentence) and any(sentence in self.simplify(line.text) for line in request.lines if line.speaker == "agent")

    def simplify(self, text: str) -> str:
        return re.sub(r"[^a-z ]", "", text.lower().replace("’", "'").replace("'", ""))
