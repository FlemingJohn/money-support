from typing import TypedDict

from app.analysis.models.CallLine import CallLine


class LineTask(TypedDict):
    line: CallLine
    mask_kinds: list[str]
