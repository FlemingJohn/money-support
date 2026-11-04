from pydantic import BaseModel


class TopicOutput(BaseModel):
    topic: str
    matched_faq_number: int
