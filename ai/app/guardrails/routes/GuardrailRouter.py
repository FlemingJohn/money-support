from fastapi import APIRouter, Depends
from fastapi.concurrency import run_in_threadpool

from app.common.guards.ServiceSecretGuard import ServiceSecretGuard
from app.guardrails.models.RedactionRequest import RedactionRequest
from app.guardrails.models.RedactionResponse import RedactionResponse
from app.guardrails.services.PersonalDataRedactor import PersonalDataRedactor


class GuardrailRouter:
    def __init__(self, personal_data_redactor: PersonalDataRedactor, service_secret_guard: ServiceSecretGuard) -> None:
        self.personal_data_redactor = personal_data_redactor
        self.service_secret_guard = service_secret_guard

    def make(self) -> APIRouter:
        router = APIRouter(prefix="/guardrails", tags=["guardrails"], dependencies=[Depends(self.service_secret_guard)])
        router.add_api_route("/redact", self.redact, methods=["POST"], response_model=RedactionResponse)
        return router

    async def redact(self, request: RedactionRequest) -> RedactionResponse:
        results = await run_in_threadpool(self.personal_data_redactor.redact_texts, request.texts)
        return RedactionResponse(results=results)
