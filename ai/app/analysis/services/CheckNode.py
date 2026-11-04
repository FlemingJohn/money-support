from app.analysis.clients.StructuredModel import StructuredModel
from app.analysis.models.CallChecks import CallChecks
from app.analysis.outputs.CheckOutput import CheckOutput
from app.analysis.services.TranscriptFormatter import TranscriptFormatter
from app.analysis.state.CallAnalysisState import CallAnalysisState
from app.common.services.TemplateRenderer import TemplateRenderer


class CheckNode:
    sensitive_labels = {"card number", "bank account number"}

    def __init__(self, model: StructuredModel, template_renderer: TemplateRenderer, transcript_formatter: TranscriptFormatter) -> None:
        self.model = model
        self.template_renderer = template_renderer
        self.transcript_formatter = transcript_formatter

    async def __call__(self, state: CallAnalysisState) -> dict:
        request = state["request"]
        instructions = self.template_renderer.render("analysis/Checks.md", faqs=request.faqs, hand_off_sentence=request.hand_off_sentence)
        mentioned = any(label in self.sensitive_labels for line in state["masked_lines"] for label in line.removed_kinds)
        try:
            output = await self.model.ask(instructions, self.transcript_formatter.format(state["masked_lines"]), CheckOutput)
        except Exception:
            return {"checks": None, "failed_steps": ["check_call"]}
        return {
            "checks": CallChecks(
                card_or_account_mentioned=mentioned,
                hand_off_expected=output.hand_off_expected,
                agent_repeated_personal_data=output.agent_repeated_personal_data,
                possible_mistake=output.possible_mistake,
                reason=output.reason.strip()[:300],
            )
        }
