from app.analysis.models.CallChecks import CallChecks
from app.analysis.models.ExtractedField import ExtractedField
from app.analysis.models.MaskedLine import MaskedLine
from app.analysis.models.SuggestedReview import SuggestedReview


class ReviewSuggester:
    low_confidence = 0.75

    def suggest(self, is_handed_off: bool, lines: list[MaskedLine], fields: list[ExtractedField], checks: CallChecks | None) -> SuggestedReview | None:
        if is_handed_off:
            return SuggestedReview(reason="handOff", note="The agent handed the caller to a person.")
        if any(line.removed_kinds or not line.is_checked for line in lines) or (checks and checks.agent_repeated_personal_data):
            return SuggestedReview(reason="guardrail", note="Personal data was found in the call.")
        if any(field.confidence < self.low_confidence for field in fields):
            return SuggestedReview(reason="lowConfidence", note="A detail from the call is unclear.")
        if checks and (checks.possible_mistake or checks.hand_off_expected):
            return SuggestedReview(reason="possibleMistake", note=checks.reason or "The agent may have handled this call wrongly.")
        return None
