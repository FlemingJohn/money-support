from app.analysis.clients.StructuredModel import StructuredModel
from app.analysis.outputs.TopicOutput import TopicOutput
from app.analysis.services.TranscriptFormatter import TranscriptFormatter
from app.analysis.state.CallAnalysisState import CallAnalysisState
from app.common.services.TemplateRenderer import TemplateRenderer


class TopicNode:
    def __init__(self, model: StructuredModel, template_renderer: TemplateRenderer, transcript_formatter: TranscriptFormatter) -> None:
        self.model = model
        self.template_renderer = template_renderer
        self.transcript_formatter = transcript_formatter

    async def __call__(self, state: CallAnalysisState) -> dict:
        faqs = state["request"].faqs
        instructions = self.template_renderer.render("analysis/Topic.md", faqs=faqs)
        try:
            output = await self.model.ask(instructions, self.transcript_formatter.format(state["masked_lines"]), TopicOutput)
        except Exception:
            return {"topic": None, "matched_faq_number": None, "failed_steps": ["classify_topic"]}
        known_numbers = {faq.number for faq in faqs}
        matched = output.matched_faq_number if output.matched_faq_number in known_numbers else None
        return {"topic": output.topic.strip()[:200] or None, "matched_faq_number": matched}
