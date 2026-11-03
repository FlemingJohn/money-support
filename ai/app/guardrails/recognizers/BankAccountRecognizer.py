from presidio_analyzer import Pattern, PatternRecognizer


class BankAccountRecognizer(PatternRecognizer):
    def __init__(self) -> None:
        super().__init__(
            supported_entity="BANK_ACCOUNT_NUMBER",
            patterns=[Pattern(name="account digits", regex=r"\b\d{8,12}\b", score=0.2)],
            context=["account", "bank"],
        )
