from app.analysis.services.OwnNumberMatcher import OwnNumberMatcher


class OwnNumberMatcherTest:
    matcher = OwnNumberMatcher()
    caller_number = "+919876541363"

    def test_matches_the_whole_number_however_it_is_written(self) -> None:
        assert self.matcher.is_own_number("98765 41363", self.caller_number)
        assert self.matcher.is_own_number("+91 98765-41363", self.caller_number)
        assert self.matcher.is_own_number("098765 41363", self.caller_number)

    def test_matches_the_last_four_or_more_digits(self) -> None:
        assert self.matcher.is_own_number("ends in 1363", self.caller_number)

    def test_does_not_match_another_number(self) -> None:
        assert not self.matcher.is_own_number("91234 56789", self.caller_number)

    def test_does_not_match_fewer_than_four_digits(self) -> None:
        assert not self.matcher.is_own_number("363", self.caller_number)

    def test_does_not_match_without_a_caller_number(self) -> None:
        assert not self.matcher.is_own_number("98765 41363", "")
