from presidio_analyzer import Pattern, PatternRecognizer


class SortCodeRecognizer(PatternRecognizer):
    def __init__(self) -> None:
        super().__init__(
            supported_entity="SORT_CODE",
            patterns=[Pattern(name="sort code", regex=r"\b\d{2}[- ]\d{2}[- ]\d{2}\b", score=0.5)],
            context=["sort", "code", "bank"],
        )
