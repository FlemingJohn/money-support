from app.common.models.CamelModel import CamelModel
from app.evaluation.models.EvaluationCaseResult import EvaluationCaseResult


class EvaluationReport(CamelModel):
    passed_count: int
    failed_count: int
    error_count: int
    results: list[EvaluationCaseResult]

    @classmethod
    def from_results(cls, results: list[EvaluationCaseResult]) -> "EvaluationReport":
        return cls(
            passed_count=sum(result.status == "passed" for result in results),
            failed_count=sum(result.status == "failed" for result in results),
            error_count=sum(result.status == "error" for result in results),
            results=results,
        )
