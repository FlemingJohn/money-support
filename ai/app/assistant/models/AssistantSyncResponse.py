from app.common.models.CamelModel import CamelModel


class AssistantSyncResponse(CamelModel):
    prompt_hash: str
    prompt_content: str
