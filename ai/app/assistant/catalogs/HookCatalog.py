from app.backend.models.AgentSettings import AgentSettings


class HookCatalog:
    reminder_count = 2

    def make_hooks(self, agent: AgentSettings) -> list[dict]:
        return [
            self.make_silence_reminder(agent.silence_seconds),
            self.make_silence_goodbye(agent.silence_seconds),
            self.make_unclear_speech_hook(),
        ]

    def make_silence_reminder(self, silence_seconds: int) -> dict:
        return {
            "name": "silence reminder",
            "on": "customer.speech.timeout",
            "options": {
                "timeoutSeconds": silence_seconds,
                "triggerMaxCount": self.reminder_count,
                "triggerResetMode": "onUserSpeech",
            },
            "do": [{"type": "say", "exact": "Are you still there?"}],
        }

    def make_silence_goodbye(self, silence_seconds: int) -> dict:
        return {
            "name": "silence goodbye",
            "on": "customer.speech.timeout",
            "options": {"timeoutSeconds": silence_seconds * 2, "triggerMaxCount": 1},
            "do": [
                {"type": "say", "exact": "I haven't heard anything, so I'll end the call now. Goodbye."},
                {"type": "tool", "tool": {"type": "endCall"}},
            ],
        }

    def make_unclear_speech_hook(self) -> dict:
        return {
            "on": "assistant.transcriber.endpointedSpeechLowConfidence",
            "do": [{"type": "say", "exact": "Sorry, I didn't catch that. Could you say it again?"}],
        }
