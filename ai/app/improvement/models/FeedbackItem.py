from app.common.models.CamelModel import CamelModel


class FeedbackItem(CamelModel):
    review_call_id: str
    caller_line: str
    reason: str
    expectation: str
