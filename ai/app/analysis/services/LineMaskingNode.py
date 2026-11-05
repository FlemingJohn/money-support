from app.analysis.models.MaskedLine import MaskedLine
from app.analysis.services.LineMasker import LineMasker
from app.analysis.state.LineTask import LineTask


class LineMaskingNode:
    def __init__(self, line_masker: LineMasker) -> None:
        self.line_masker = line_masker

    async def __call__(self, task: LineTask) -> dict:
        line = task["line"]
        result = await self.line_masker.mask(line.text, task["mask_kinds"], task["caller_number"])
        masked_line = MaskedLine(position=line.position, speaker=line.speaker, redacted_text=result.redacted_text, removed_kinds=result.removed_kinds, is_checked=result.is_checked)
        failed_steps = [] if result.is_checked else [f"mask_line:{line.position}"]
        return {"masked_lines": [masked_line], "failed_steps": failed_steps}
