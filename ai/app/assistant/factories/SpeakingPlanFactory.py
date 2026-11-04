class SpeakingPlanFactory:
    extra_interruption_phrases = ["sorry", "excuse me", "hang on", "one moment"]
    default_interruption_phrases = [
        "stop", "shut", "up", "enough", "quiet", "silence", "but", "dont", "not", "no",
        "hold", "wait", "cut", "pause", "nope", "nah", "nevermind", "never", "bad", "actually",
    ]

    def make_start_plan(self) -> dict:
        return {"waitSeconds": 0.6, "smartEndpointingPlan": {"provider": "livekit"}}

    def make_stop_plan(self) -> dict:
        return {
            "numWords": 2,
            "backoffSeconds": 1,
            "interruptionPhrases": self.default_interruption_phrases + self.extra_interruption_phrases,
        }
