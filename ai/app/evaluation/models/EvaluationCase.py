from app.common.models.CamelModel import CamelModel
from app.evaluation.models.EvaluationTurn import EvaluationTurn


class EvaluationCase(CamelModel):
    id: str
    name: str
    turns: list[EvaluationTurn]
