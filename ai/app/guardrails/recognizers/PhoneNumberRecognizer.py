from presidio_analyzer import Pattern, PatternRecognizer


class PhoneNumberRecognizer(PatternRecognizer):
    def __init__(self) -> None:
        super().__init__(
            supported_entity="PHONE_NUMBER",
            patterns=[Pattern(name="international number", regex=r"\+\d[\d ()-]{7,}\d", score=0.6)],
            context=["phone", "call", "number", "mobile"],
        )
