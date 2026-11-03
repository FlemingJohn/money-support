from app.common.models.CamelModel import CamelModel


class ScenarioCheck(CamelModel):
    name: str
    question: str
    expected: bool = True
