class HandOffReasonCatalog:
    default_reason = "outOfScope"
    descriptions = {
        "askedForPerson": "asked to speak to a person",
        "outOfScope": "has a question the agent cannot answer",
        "accountChange": "needs something changed on their account",
        "possibleScam": "reported a possible scam",
        "abusive": "kept being abusive",
        "otherLanguage": "speaks another language",
        "notUnderstood": "could not be understood",
        "inDanger": "said they or someone else is in danger",
    }
    openings = {
        "askedForPerson": "Of course, I'll pass you to our support team now.",
        "outOfScope": "I'm sorry, I can't help with that on this line, so I'm passing you to our support team.",
        "accountChange": "I'm sorry, I can't make changes to your account on this line, so I'm passing you to our support team.",
        "possibleScam": "I'm so sorry that's happened. I'm passing you to our support team straight away.",
        "abusive": "I'm going to pass you to our support team now.",
        "otherLanguage": "I'm sorry, I can only help in English on this line, so I'm passing you to our support team.",
        "notUnderstood": "I'm sorry, I'm having trouble understanding, so I'm passing you to our support team.",
        "inDanger": "If you're in danger, please contact your local emergency services right away. I'm also passing you to our support team.",
    }

    @property
    def reasons(self) -> list[str]:
        return list(self.descriptions)

    def normalise(self, reason: str) -> str:
        return reason if reason in self.descriptions else self.default_reason

    def describe(self, reason: str) -> str:
        return self.descriptions[self.normalise(reason)]
