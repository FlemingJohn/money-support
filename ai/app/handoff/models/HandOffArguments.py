from app.common.models.CamelModel import CamelModel


class HandOffArguments(CamelModel):
    reason: str = "outOfScope"
    caller_need: str = ""
