from langgraph.graph import END, START, StateGraph

from app.improvement.services.FeedbackNode import FeedbackNode
from app.improvement.services.ProposeRuleNode import ProposeRuleNode
from app.improvement.services.TestRuleNode import TestRuleNode
from app.improvement.state.ImprovementState import ImprovementState


class ImprovementGraph:
    def __init__(self, feedback_node: FeedbackNode, propose_rule_node: ProposeRuleNode, test_rule_node: TestRuleNode) -> None:
        self.compiled = self.build(feedback_node, propose_rule_node, test_rule_node)

    async def run(self) -> ImprovementState:
        return await self.compiled.ainvoke({})

    def stream(self):
        return self.compiled.astream({}, stream_mode=["custom", "values"])

    def build(self, feedback_node: FeedbackNode, propose_rule_node: ProposeRuleNode, test_rule_node: TestRuleNode):
        graph = StateGraph(ImprovementState)
        graph.add_node("collect_feedback", feedback_node)
        graph.add_node("propose_rule", propose_rule_node)
        graph.add_node("test_rule", test_rule_node)
        graph.add_edge(START, "collect_feedback")
        graph.add_conditional_edges("collect_feedback", self.has_feedback, {True: "propose_rule", False: END})
        graph.add_edge("propose_rule", "test_rule")
        graph.add_edge("test_rule", END)
        return graph.compile()

    def has_feedback(self, state: ImprovementState) -> bool:
        return len(state.get("feedback", [])) > 0
