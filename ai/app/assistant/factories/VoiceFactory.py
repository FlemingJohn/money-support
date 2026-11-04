from app.backend.models.AgentSettings import AgentSettings


class VoiceFactory:
    speaking_speed = 0.9

    def make(self, agent: AgentSettings) -> dict:
        return {"provider": "vapi", "voiceId": agent.voice, "speed": self.speaking_speed}
