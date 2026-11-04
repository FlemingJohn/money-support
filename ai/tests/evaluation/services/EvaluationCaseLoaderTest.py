from app.evaluation.services.EvaluationCaseLoader import EvaluationCaseLoader
from tests.support.SampleData import SampleData


class EvaluationCaseLoaderTest:
    def load_cases(self):
        return EvaluationCaseLoader(SampleData().make_configuration().evaluation_cases_folder).load_cases()

    def test_loads_every_case_in_order(self) -> None:
        assert [case.id for case in self.load_cases()] == [f"E{number:02d}" for number in range(1, 26)]

    def test_every_case_ends_with_a_checked_assistant_turn(self) -> None:
        for case in self.load_cases():
            assert case.turns[-1].role == "assistant"
            assert case.turns[-1].is_checked

    def test_every_answer_check_has_an_expectation(self) -> None:
        answer_turns = [turn for case in self.load_cases() for turn in case.turns if turn.check == "answers"]
        assert all(turn.expectation for turn in answer_turns)
