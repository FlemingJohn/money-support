from langgraph.graph import END, START, StateGraph
from langgraph.types import Send

from app.analysis.services.CheckNode import CheckNode
from app.analysis.services.FieldsNode import FieldsNode
from app.analysis.services.LineMaskingNode import LineMaskingNode
from app.analysis.services.SummaryNode import SummaryNode
from app.analysis.services.TopicNode import TopicNode
from app.analysis.state.CallAnalysisState import CallAnalysisState


class CallAnalysisGraph:
    def __init__(self, line_masking_node: LineMaskingNode, summary_node: SummaryNode, topic_node: TopicNode, fields_node: FieldsNode, check_node: CheckNode) -> None:
        self.compiled = self.build(line_masking_node, summary_node, topic_node, fields_node, check_node)

    async def run(self, state: CallAnalysisState) -> CallAnalysisState:
        return await self.compiled.ainvoke(state)

    def build(self, line_masking_node: LineMaskingNode, summary_node: SummaryNode, topic_node: TopicNode, fields_node: FieldsNode, check_node: CheckNode):
        graph = StateGraph(CallAnalysisState)
        graph.add_node("mask_line", line_masking_node)
        graph.add_node("join_lines", self.join_lines)
        graph.add_node("summarise", summary_node)
        graph.add_node("classify_topic", topic_node)
        graph.add_node("extract_fields", fields_node)
        graph.add_node("check_call", check_node)
        graph.add_conditional_edges(START, self.fan_out_lines, ["mask_line", "join_lines"])
        graph.add_edge("mask_line", "join_lines")
        for step in ["summarise", "classify_topic", "extract_fields"]:
            graph.add_edge("join_lines", step)
        graph.add_edge(["summarise", "classify_topic", "extract_fields"], "check_call")
        graph.add_edge("check_call", END)
        return graph.compile()

    def fan_out_lines(self, state: CallAnalysisState) -> list[Send] | str:
        request = state["request"]
        if not request.lines:
            return "join_lines"
        return [Send("mask_line", {"line": line, "mask_kinds": request.mask_kinds, "caller_number": request.caller_number}) for line in request.lines]

    def join_lines(self, state: CallAnalysisState) -> dict:
        return {}
