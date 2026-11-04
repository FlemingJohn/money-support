from app.analysis.clients.StructuredModel import StructuredModel
from app.analysis.outputs.SummaryOutput import SummaryOutput
from app.analysis.services.TranscriptFormatter import TranscriptFormatter
from app.analysis.state.CallAnalysisState import CallAnalysisState
from app.common.services.TemplateRenderer import TemplateRenderer


class SummaryNode:
    def __init__(self, model: StructuredModel, template_renderer: TemplateRenderer, transcript_formatter: TranscriptFormatter) -> None:
        self.model = model
        self.template_renderer = template_renderer
        self.transcript_formatter = transcript_formatter

    async def __call__(self, state: CallAnalysisState) -> dict:
        try:
            output = await self.model.ask(self.template_renderer.render("analysis/Summary.md"), self.transcript_formatter.format(state["masked_lines"]), SummaryOutput)
        except Exception:
            return {"summary": None, "failed_steps": ["summarise"]}
        return {"summary": output.summary.strip()}
