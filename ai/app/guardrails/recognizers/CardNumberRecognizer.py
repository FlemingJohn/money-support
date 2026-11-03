from presidio_analyzer import Pattern, PatternRecognizer


class CardNumberRecognizer(PatternRecognizer):
    def __init__(self) -> None:
        super().__init__(
            supported_entity="CARD_NUMBER",
            patterns=[Pattern(name="long digit run", regex=r"\b(?:\d[ -]?){12,18}\d\b", score=0.6)],
            context=["card", "debit", "credit", "visa", "mastercard"],
        )
