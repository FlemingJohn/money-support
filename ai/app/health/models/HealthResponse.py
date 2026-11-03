from typing import Literal

from app.common.models.CamelModel import CamelModel


class HealthResponse(CamelModel):
    status: Literal["ok"]
