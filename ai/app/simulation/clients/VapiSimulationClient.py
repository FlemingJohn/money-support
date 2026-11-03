import uuid

from app.vapi.clients.VapiClient import VapiClient


class VapiSimulationClient:
    def __init__(self, vapi_client: VapiClient) -> None:
        self.vapi_client = vapi_client

    async def start_run(self, entries: list[dict], assistant_id: str) -> dict:
        return await self.vapi_client.post(
            "/eval/simulation/run",
            {
                "simulations": entries,
                "target": {"type": "assistant", "assistantId": assistant_id},
                "transport": {"provider": "vapi.webchat"},
                "iterations": 1,
            },
            headers={"Idempotency-Key": str(uuid.uuid4())},
        )

    async def get_run(self, run_id: str) -> dict:
        return await self.vapi_client.get(f"/eval/simulation/run/{run_id}")
