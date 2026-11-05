import asyncio
from collections.abc import AsyncIterator

from app.common.exceptions.ServiceError import ServiceError
from app.common.services.ServerSentEvents import ServerSentEvents
from app.evaluation.models.EvaluationCaseResult import EvaluationCaseResult
from app.evaluation.models.EvaluationProgress import EvaluationProgress
from app.evaluation.services.EvaluationRunner import EvaluationRunner


class EvaluationStreamService:
    def __init__(self, evaluation_runner: EvaluationRunner, server_sent_events: ServerSentEvents) -> None:
        self.evaluation_runner = evaluation_runner
        self.server_sent_events = server_sent_events

    async def stream(self) -> AsyncIterator[str]:
        events: asyncio.Queue[dict] = asyncio.Queue()
        progress = EvaluationProgress(on_start=lambda total: events.put({"type": "started", "total": total}), on_result=lambda result: events.put(self.to_result_event(result)))
        run = asyncio.create_task(self.run_into(events, progress))
        while True:
            event = await events.get()
            yield self.server_sent_events.format(event)
            if event["type"] in ("finished", "error"):
                break
        await run

    async def run_into(self, events: asyncio.Queue[dict], progress: EvaluationProgress) -> None:
        try:
            report = await self.evaluation_runner.run(progress=progress)
            await events.put({"type": "finished", "report": report.model_dump(by_alias=True)})
        except ServiceError as error:
            await events.put({"type": "error", "message": error.message})

    def to_result_event(self, result: EvaluationCaseResult) -> dict:
        return {"type": "result", "result": result.model_dump(by_alias=True)}
