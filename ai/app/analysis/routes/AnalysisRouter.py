from fastapi import APIRouter, Depends

from app.analysis.models.AnalysisRequest import AnalysisRequest
from app.analysis.models.AnalysisResponse import AnalysisResponse
from app.analysis.models.LineMaskingRequest import LineMaskingRequest
from app.analysis.models.LineMaskingResponse import LineMaskingResponse
from app.analysis.services.CallAnalysisService import CallAnalysisService
from app.analysis.services.LineMasker import LineMasker
from app.common.guards.ServiceSecretGuard import ServiceSecretGuard


class AnalysisRouter:
    def __init__(self, call_analysis_service: CallAnalysisService, line_masker: LineMasker, service_secret_guard: ServiceSecretGuard) -> None:
        self.call_analysis_service = call_analysis_service
        self.line_masker = line_masker
        self.service_secret_guard = service_secret_guard

    def make(self) -> APIRouter:
        router = APIRouter(tags=["analysis"], dependencies=[Depends(self.service_secret_guard)])
        router.add_api_route("/analysis", self.analyse, methods=["POST"], response_model=AnalysisResponse)
        router.add_api_route("/masking/line", self.mask_line, methods=["POST"], response_model=LineMaskingResponse)
        return router

    async def analyse(self, request: AnalysisRequest) -> AnalysisResponse:
        return await self.call_analysis_service.analyse(request)

    async def mask_line(self, request: LineMaskingRequest) -> LineMaskingResponse:
        return await self.line_masker.mask(request.text, request.mask_kinds)
