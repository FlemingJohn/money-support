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
                {"type": "request-complete", "role": "assistant", "content": hand_off.hand_off_sentence, "endCallAfterSpokenEnabled": True},
                {"type": "request-failed", "content": hand_off.hand_off_sentence, "endCallAfterSpokenEnabled": True},
            ],
        }

    def make_function(self) -> dict:
        return {
            "name": self.tool_name,
            "description": "Hands the caller to the human support team. Before calling it, always say one short sentence to the caller telling them why and that you are passing them to the support team. The team's phone rings straight away, then the caller hears the hand-off sentence and the call ends.",
            "parameters": {
                "type": "object",
                "properties": {
                    "reason": {"type": "string", "enum": self.reason_catalog.reasons, "description": "Why the caller needs a person"},
                    "callerNeed": {"type": "string", "description": "What the caller needs, in a few words, with no names, numbers or other personal details"},
                },
                "required": ["reason", "callerNeed"],
            },
        }
