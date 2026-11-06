from app.backend.models.HandOffSettings import HandOffSettings
from app.configuration.AppConfiguration import AppConfiguration
from app.handoff.catalogs.HandOffReasonCatalog import HandOffReasonCatalog


class HandOffToolFactory:
    tool_name = "handOffToHuman"

    def __init__(self, configuration: AppConfiguration, reason_catalog: HandOffReasonCatalog) -> None:
        self.configuration = configuration
        self.reason_catalog = reason_catalog

    def make(self, hand_off: HandOffSettings) -> dict:
        return {
            "type": "function",
            "function": self.make_function(),
            "server": {
                "url": f"{self.configuration.ai_public_url}/tools/hand-off",
                "headers": {"x-vapi-secret": self.configuration.vapi_webhook_secret},
                "timeoutSeconds": 20,
            },
            "messages": [
                *self.make_opening_messages(),
                {"type": "request-complete", "role": "assistant", "content": hand_off.hand_off_sentence, "endCallAfterSpokenEnabled": True},
                {"type": "request-failed", "content": hand_off.hand_off_sentence, "endCallAfterSpokenEnabled": True},
            ],
        }

    def make_opening_messages(self) -> list[dict]:
        return [
            {"type": "request-start", "content": opening, "conditions": [{"param": "reason", "operator": "eq", "value": reason}]}
            for reason, opening in self.reason_catalog.openings.items()
        ]

    def make_function(self) -> dict:
        return {
            "name": self.tool_name,
            "description": "Hands the caller to the human support team. Call it without saying anything first: it tells the caller why, rings the team's phone straight away, then says the hand-off sentence and ends the call.",
            "parameters": {
                "type": "object",
                "properties": {
                    "reason": {"type": "string", "enum": self.reason_catalog.reasons, "description": "Why the caller needs a person"},
                    "callerNeed": {"type": "string", "description": "What the caller needs, in a few words, with no names, numbers or other personal details"},
                },
                "required": ["reason", "callerNeed"],
            },
        }
