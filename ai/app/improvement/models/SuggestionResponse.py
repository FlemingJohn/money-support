from app.common.models.CamelModel import CamelModel


class SuggestionResponse(CamelModel):
    rule_text: str
    explanation: str
    review_call_ids: list[str]
    passed_before: int
    passed_after: int
    total_tests: int
    is_better: bool
