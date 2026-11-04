from app.analysis.clients.StructuredModel import StructuredModel
from app.analysis.models.ExtractedField import ExtractedField
from app.analysis.outputs.FieldOutput import FieldOutput
from app.analysis.outputs.FieldsOutput import FieldsOutput
from app.analysis.services.TranscriptFormatter import TranscriptFormatter
from app.analysis.state.CallAnalysisState import CallAnalysisState
from app.common.services.TemplateRenderer import TemplateRenderer


class FieldsNode:
    def __init__(self, model: StructuredModel, template_renderer: TemplateRenderer, transcript_formatter: TranscriptFormatter) -> None:
        self.model = model
        self.template_renderer = template_renderer
        self.transcript_formatter = transcript_formatter

    async def __call__(self, state: CallAnalysisState) -> dict:
        try:
            output = await self.model.ask(self.template_renderer.render("analysis/Fields.md"), self.transcript_formatter.format(state["masked_lines"]), FieldsOutput)
        except Exception:
            return {"fields": [], "failed_steps": ["extract_fields"]}
        positions = {line.position for line in state["masked_lines"]}
        return {"fields": [self.to_field(field, positions) for field in output.fields if field.label.strip() and field.value.strip()]}

    def to_field(self, field: FieldOutput, positions: set[int]) -> ExtractedField:
        confidence = field.confidence / 100 if field.confidence > 1 else field.confidence
        return ExtractedField(
            label=field.label.strip(),
            value=field.value.strip(),
            confidence=min(max(confidence, 0), 1),
            line_position=field.line_position if field.line_position in positions else None,
        )
