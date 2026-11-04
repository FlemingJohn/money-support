from app.common.models.CamelModel import CamelModel


class FaqSummary(CamelModel):
    number: int
    question: str
