from abc import ABC, abstractmethod

from pydantic import BaseModel


class StructuredModel(ABC):
    @abstractmethod
    async def ask[Output: BaseModel](self, instructions: str, text: str, output_type: type[Output]) -> Output: ...
