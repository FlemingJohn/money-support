from app.vapi.clients.VapiClient import VapiClient
from app.vapi.exceptions.VapiRequestError import VapiRequestError


class VapiEvaluationClient:
    def __init__(self, vapi_client: VapiClient) -> None:
        self.vapi_client = vapi_client

    async def start_run(self, mock_conversation: dict, assistant_id: str) -> str:
        started = await self.vapi_client.post(
            "/eval/run",
            {"type": "eval", "eval": mock_conversation, "target": {"type": "assistant", "assistantId": assistant_id}},
        )
        run_id = started.get("evalRunId") or started.get("id")
        if not run_id:
            raise VapiRequestError(f"Vapi did not return an eval run id: {started}")
        return run_id

    async def get_run(self, run_id: str) -> dict:
        return await self.vapi_client.get(f"/eval/run/{run_id}")
