from app.backend.models.AssistantSettings import AssistantSettings
from app.backend.models.Faq import Faq
from app.configuration.AppConfiguration import AppConfiguration


class SampleData:
    hand_off_sentence = "That's not something I can help with on this line, so I'm transferring you to a human agent."

    def make_configuration(self, **overrides: object) -> AppConfiguration:
        return AppConfiguration(_env_file=None, service_secret="secret", vapi_api_key="vapi-key", poll_interval_seconds=0, **overrides)

    def make_faqs(self) -> list[Faq]:
        return [
            Faq(id="faq-2", number=2, question="When will my money arrive?", answer="Check the estimate on the transfer.", category="arrival", is_active=True),
            Faq(id="faq-1", number=1, question="How do I check my transfer's status?", answer="Log in and open the transfer.", category="status", is_active=True),
        ]

    def make_faq_rows(self) -> list[dict]:
        return [faq.model_dump(by_alias=True) | {"updatedAt": "2026-11-03T10:00:00.000Z"} for faq in self.make_faqs()]

    def make_settings_rows(self, mode: str = "endCall") -> dict:
        return {
            "agent": {
                "assistantName": "Money Support Agent",
                "language": "en",
                "greeting": "Hi, how can I help?",
                "voice": "Elliot",
                "longestCallMinutes": 10,
                "silenceSeconds": 10,
            },
            "handOff": {
                "mode": mode,
                "handOffSentence": self.hand_off_sentence,
                "transferNumber": "+447700900123" if mode == "transfer" else "",
                "teamHours": "weekdays",
            },
            "privacy": {
                "maskCardNumbers": True,
                "maskBankAccountNumbers": True,
                "maskEmailAddresses": True,
                "maskNames": True,
                "keepNumbersForCallbacks": True,
                "deleteVapiCopy": True,
                "startInPrivacyMode": False,
                "transcriptRetentionDays": 30,
            },
            "phone": {"deskPhone": "", "mobilePhone": "", "storedNumberRetention": "untilResolved"},
        }

    def make_settings(self, mode: str = "endCall") -> AssistantSettings:
        return AssistantSettings.model_validate(self.make_settings_rows(mode))
