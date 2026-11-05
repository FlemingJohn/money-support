from app.handoff.catalogs.HandOffReasonCatalog import HandOffReasonCatalog
from app.handoff.state.HandOffState import HandOffState


class ReasonNode:
    def __init__(self, reason_catalog: HandOffReasonCatalog) -> None:
        self.reason_catalog = reason_catalog

    def __call__(self, state: HandOffState) -> dict:
        reason = self.reason_catalog.normalise(state["reason"])
        return {"reason": reason, "reason_description": self.reason_catalog.describe(reason)}
