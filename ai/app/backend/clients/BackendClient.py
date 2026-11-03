from collections.abc import Callable

import httpx
from pydantic import TypeAdapter, ValidationError

from app.backend.exceptions.BackendRequestError import BackendRequestError
from app.backend.models.AssistantSettings import AssistantSettings
from app.backend.models.Faq import Faq


class BackendClient:
    faq_list = TypeAdapter(list[Faq])

    def __init__(self, http_client: httpx.AsyncClient) -> None:
        self.http_client = http_client

    async def get_active_faqs(self) -> list[Faq]:
        body = await self.get("/internal/faqs")
        return self.parse(lambda: self.faq_list.validate_python(body))

    async def get_assistant_settings(self) -> AssistantSettings:
        body = await self.get("/internal/settings")
        return self.parse(lambda: AssistantSettings.model_validate(body))

    async def get(self, path: str) -> object:
        try:
            response = await self.http_client.get(path)
        except httpx.HTTPError as error:
            raise BackendRequestError(f"The backend could not be reached: {error}") from error
        if response.is_error:
            raise BackendRequestError(f"The backend answered {response.status_code} for {path}")
        return response.json()

    def parse[Value](self, read: Callable[[], Value]) -> Value:
        try:
            return read()
        except ValidationError as error:
            raise BackendRequestError(f"The backend sent an unexpected shape: {error}") from error
