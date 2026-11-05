from langgraph.graph import END, START, StateGraph

from app.handoff.services.ReasonNode import ReasonNode
from app.handoff.services.RingTeamNode import RingTeamNode
from app.handoff.state.HandOffState import HandOffState


class HandOffGraph:
    def __init__(self, reason_node: ReasonNode, ring_team_node: RingTeamNode) -> None:
        self.compiled = self.build(reason_node, ring_team_node)

    async def run(self, state: HandOffState) -> HandOffState:
        return await self.compiled.ainvoke(state)

    def build(self, reason_node: ReasonNode, ring_team_node: RingTeamNode):
        graph = StateGraph(HandOffState)
        graph.add_node("describe_reason", reason_node)
        graph.add_node("ring_team", ring_team_node)
        graph.add_edge(START, "describe_reason")
        graph.add_edge("describe_reason", "ring_team")
        graph.add_edge("ring_team", END)
        return graph.compile()
