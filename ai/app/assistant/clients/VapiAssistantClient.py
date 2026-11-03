from app.assistant.exceptions.AssistantNotSyncedError import AssistantNotSyncedError
from app.configuration.AppConfiguration import AppConfiguration
from app.vapi.clients.VapiClient import VapiClient


class VapiAssistantClient:
    def __init__(self, configuration: AppConfiguration, vapi_client: VapiClient) -> None:
        self.configuration = configuration
        self.vapi_client = vapi_client

    async def save(self, assistant: dict) -> str:
        assistant_id = await self.find_assistant_id()
        if assistant_id is None:
            created = await self.vapi_client.post("/assistant", assistant)
            return created["id"]
        await self.vapi_client.patch(f"/assistant/{assistant_id}", assistant)
        return assistant_id

    async def get_assistant_id(self) -> str:
        assistant_id = await self.find_assistant_id()
        if assistant_id is None:
            raise AssistantNotSyncedError("The assistant has not been synced to Vapi yet")
        return assistant_id

    async def find_assistant_id(self) -> str | None:
        assistants = await self.vapi_client.get("/assistant", {"limit": 1000})
        return next((assistant["id"] for assistant in assistants if self.is_ours(assistant)), None)

    def is_ours(self, assistant: dict) -> bool:
        return (assistant.get("metadata") or {}).get("service") == self.configuration.assistant_tag
