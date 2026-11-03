from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from app.ServiceContainer import ServiceContainer
from app.common.exceptions.ServiceError import ServiceError


class ApplicationFactory:
    def __init__(self, container: ServiceContainer) -> None:
        self.container = container

    def make(self) -> FastAPI:
        application = FastAPI(title="Money Support ai", lifespan=self.lifespan)
        for router in self.container.make_routers():
            application.include_router(router)
        application.add_exception_handler(ServiceError, self.handle_service_error)
        return application

    @asynccontextmanager
    async def lifespan(self, application: FastAPI) -> AsyncIterator[None]:
        yield
        await self.container.close()

    async def handle_service_error(self, request: Request, error: ServiceError) -> JSONResponse:
        return JSONResponse(status_code=error.status_code, content={"message": error.message})
