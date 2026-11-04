class MentionedNumberPatternCatalog:
    nearby_words = r"[^0-9\n]{0,25}"
    spoken_digits = r"\d(?:[\s-]?\d){2,}"
    money_words = r"(?![\s-]?\d)(?!\s*(?:pounds?|euros?|dollars?|rupees?|gbp|eur|usd|inr|%))"

    def make_pattern(self, keywords: list[str]) -> str:
        keyword_choice = "|".join(keywords)
        return rf"(?<=\b(?:{keyword_choice})\b{self.nearby_words}){self.spoken_digits}{self.money_words}"
