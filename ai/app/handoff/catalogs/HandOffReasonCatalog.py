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
    }

    @property
    def reasons(self) -> list[str]:
        return list(self.descriptions)

    def normalise(self, reason: str) -> str:
        return reason if reason in self.descriptions else self.default_reason

    def describe(self, reason: str) -> str:
        return self.descriptions[self.normalise(reason)]
