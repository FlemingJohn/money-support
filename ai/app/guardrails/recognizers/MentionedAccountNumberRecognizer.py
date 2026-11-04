from presidio_analyzer import Pattern, PatternRecognizer

from app.guardrails.catalogs.MentionedNumberPatternCatalog import MentionedNumberPatternCatalog


class MentionedAccountNumberRecognizer(PatternRecognizer):
    def __init__(self) -> None:
        super().__init__(
            supported_entity="BANK_ACCOUNT_NUMBER",
            name="MentionedAccountNumberRecognizer",
            patterns=[
                Pattern(
                    name="digits after account",
                    regex=MentionedNumberPatternCatalog().make_pattern(["account", "iban", r"sort\s+code"]),
                    score=0.7,
                )
            ],
        )
