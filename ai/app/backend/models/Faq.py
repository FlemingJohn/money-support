from app.common.models.CamelModel import CamelModel


class Faq(CamelModel):
    id: str
    number: int
    question: str
    answer: str
    category: str
    is_active: bool
