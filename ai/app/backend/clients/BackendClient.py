from collections.abc import Callable

import httpx
from pydantic import TypeAdapter, ValidationError

from app.backend.exceptions.BackendRequestError import BackendRequestError
from app.backend.models.AssistantSettings import AssistantSettings
from app.backend.models.Faq import Faq
from app.evaluation.models.EvaluationCase import EvaluationCase
from app.improvement.models.FeedbackItem import FeedbackItem


class BackendClient:
    faq_list = TypeAdapter(list[Faq])
    case_list = TypeAdapter(list[EvaluationCase])
    rule_list = TypeAdapter(list[str])
    feedback_list = TypeAdapter(list[FeedbackItem])

    def __init__(self, http_client: httpx.AsyncClient) -> None:
        self.http_client = http_client

    async def get_active_faqs(self) -> list[Faq]:
        body = await self.get("/internal/faqs")
        return self.parse(lambda: self.faq_list.validate_python(body))

    async def get_assistant_settings(self) -> AssistantSettings:
        body = await self.get("/internal/settings")
        return self.parse(lambda: AssistantSettings.model_validate(body))

    async def get_learned_rules(self) -> list[str]:
        body = await self.get("/internal/prompt-rules")
        return self.parse(lambda: self.rule_list.validate_python(body))

    async def get_feedback(self) -> list[FeedbackItem]:
        body = await self.get("/internal/feedback")
        return self.parse(lambda: self.feedback_list.validate_python(body))

    async def get_review_tests(self) -> list[EvaluationCase]:
        body = await self.get("/internal/review-tests")
        return self.parse(lambda: self.case_list.validate_python(body))

    async def ring_team(self, call_id: str, reason: str, caller_need: str) -> bool:
        body = await self.post("/internal/hand-offs/ring", {"callId": call_id, "reason": reason, "callerNeed": caller_need})
        return isinstance(body, dict) and body.get("isRung") is True

    async def post(self, path: str, payload: dict) -> object:
        try:
            response = await self.http_client.post(path, json=payload)
        except httpx.HTTPError as error:
            raise BackendRequestError(f"The backend could not be reached: {error}") from error
        if response.is_error:
            raise BackendRequestError(f"The backend answered {response.status_code} for {path}")
        return response.json()

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
