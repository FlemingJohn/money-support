from app.backend.models.AgentSettings import AgentSettings


class TranscriberFactory:
    key_terms = [
        "Wise",
        "transfer",
        "bank account",
        "IBAN",
        "SWIFT",
        "sort code",
        "tracking",
        "reference number",
        "proof of payment",
        "banking partner",
    ]

    def make(self, agent: AgentSettings) -> dict:
        return {"provider": "deepgram", "model": "nova-3", "language": agent.language, "keyterm": self.key_terms}
