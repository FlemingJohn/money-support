from langgraph.config import get_stream_writer

from app.analysis.clients.StructuredModel import StructuredModel
from app.common.services.TemplateRenderer import TemplateRenderer
from app.improvement.outputs.RuleProposalOutput import RuleProposalOutput
from app.improvement.state.ImprovementState import ImprovementState


class ProposeRuleNode:
    def __init__(self, model: StructuredModel, template_renderer: TemplateRenderer) -> None:
        self.model = model
        self.template_renderer = template_renderer

    async def __call__(self, state: ImprovementState) -> dict:
        write = get_stream_writer()
        write({"type": "step", "step": "rule", "status": "active"})
        mistakes = "\n".join(f"- Caller: {item.caller_line} | Wrong because: {item.reason} | Should have: {item.expectation}" for item in state["feedback"])
        output = await self.model.ask(self.template_renderer.render("improvement/ProposeRule.md"), mistakes, RuleProposalOutput)
        write({"type": "step", "step": "rule", "status": "done", "detail": output.rule_text.strip()})
        return {"rule_text": output.rule_text.strip(), "explanation": output.explanation.strip()}
