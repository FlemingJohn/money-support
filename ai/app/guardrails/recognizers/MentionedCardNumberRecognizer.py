from presidio_analyzer import Pattern, PatternRecognizer

from app.guardrails.catalogs.MentionedNumberPatternCatalog import MentionedNumberPatternCatalog


class MentionedCardNumberRecognizer(PatternRecognizer):
    def __init__(self) -> None:
        super().__init__(
            supported_entity="CARD_NUMBER",
            name="MentionedCardNumberRecognizer",
            patterns=[Pattern(name="digits after card", regex=MentionedNumberPatternCatalog().make_pattern(["card"]), score=0.7)],
        )
