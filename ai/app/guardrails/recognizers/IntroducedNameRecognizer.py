import re

from presidio_analyzer import Pattern, PatternRecognizer


class IntroducedNameRecognizer(PatternRecognizer):
    introductions = ["My name is ", "my name is ", "This is ", "this is ", "I am ", "I'm "]
    name = r"(?!Wise\b)[A-Z][a-z]+(?: [A-Z][a-z]+)?"

    def __init__(self) -> None:
        super().__init__(
            supported_entity="PERSON",
            name="IntroducedNameRecognizer",
            patterns=[Pattern(name="introduced name", regex=self.make_pattern(), score=0.7)],
            global_regex_flags=re.DOTALL | re.MULTILINE,
        )

    def make_pattern(self) -> str:
        lookbehinds = "|".join(f"(?<={re.escape(introduction)})" for introduction in self.introductions)
        return f"(?:{lookbehinds}){self.name}"
