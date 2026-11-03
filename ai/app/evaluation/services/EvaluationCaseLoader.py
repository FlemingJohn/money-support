from pathlib import Path

from app.evaluation.models.EvaluationCase import EvaluationCase


class EvaluationCaseLoader:
    def __init__(self, cases_folder: Path) -> None:
        self.cases_folder = cases_folder

    def load_cases(self) -> list[EvaluationCase]:
        return [self.load_case(path) for path in sorted(self.cases_folder.glob("*.json"))]

    def load_case(self, path: Path) -> EvaluationCase:
        return EvaluationCase.model_validate_json(path.read_text(encoding="utf-8"))
