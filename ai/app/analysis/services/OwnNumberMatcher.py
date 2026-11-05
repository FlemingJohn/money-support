import re


class OwnNumberMatcher:
    shortest_match = 4

    def is_own_number(self, spoken_text: str, caller_number: str) -> bool:
        spoken_digits = self.get_digits(spoken_text).lstrip("0")
        caller_digits = self.get_digits(caller_number)
        if len(spoken_digits) < self.shortest_match or not caller_digits:
            return False
        return caller_digits.endswith(spoken_digits)

    def get_digits(self, text: str) -> str:
        return re.sub(r"\D", "", text)
