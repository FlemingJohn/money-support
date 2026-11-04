from collections.abc import Callable

from pydantic import BaseModel

from app.analysis.clients.StructuredModel import StructuredModel


class ScriptedStructuredModel(StructuredModel):
    def __init__(self, answers: dict[type[BaseModel], Callable[[str], BaseModel]]) -> None:
        self.answers = answers
        self.questions: list[tuple[type[BaseModel], str]] = []

    async def ask[Output: BaseModel](self, instructions: str, text: str, output_type: type[Output]) -> Output:
        self.questions.append((output_type, text))
        answer = self.answers.get(output_type)
        if answer is None:
            raise RuntimeError(f"No scripted answer for {output_type.__name__}")
        return answer(text)
