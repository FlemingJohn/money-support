import re

from app.analysis.models.AnalysisRequest import AnalysisRequest


class HandOffDetector:
    hand_off_reasons = {
        "assistant-said-end-call-phrase",
        "assistant-forwarded-call",
        "call.forwarding.no-answer",
        "call.forwarding.operator-busy",
        "call.in-progress.error-transfer-failed",
        "customer-ended-call-during-transfer",
        "customer-ended-call-after-warm-transfer-attempt",
    }
    closed_sentence = "Our support team is closed right now"

    def is_handed_off(self, request: AnalysisRequest) -> bool:
        if request.ended_reason in self.hand_off_reasons:
            return True
        sentences = [self.simplify(text) for text in (request.hand_off_sentence, self.closed_sentence) if text]
        agent_lines = [self.simplify(line.text) for line in request.lines if line.speaker == "agent"]
        return any(sentence in line for sentence in sentences for line in agent_lines)

    def simplify(self, text: str) -> str:
        return re.sub(r"[^a-z ]", "", text.lower().replace("’", "'").replace("'", ""))
