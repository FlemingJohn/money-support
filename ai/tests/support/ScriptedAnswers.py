from app.analysis.outputs.CheckOutput import CheckOutput
from app.analysis.outputs.FieldOutput import FieldOutput
from app.analysis.outputs.FieldsOutput import FieldsOutput
from app.analysis.outputs.MaskedPiece import MaskedPiece
from app.analysis.outputs.MaskingOutput import MaskingOutput
from app.analysis.outputs.SummaryOutput import SummaryOutput
from app.analysis.outputs.TopicOutput import TopicOutput


class ScriptedAnswers:
    personal_pieces = {"Ananya": "name", "4 5 5 0": "card", "priya@example.com": "email"}

    def masking(self, text: str) -> MaskingOutput:
        return MaskingOutput(pieces=[MaskedPiece(text=piece, kind=kind) for piece, kind in self.personal_pieces.items() if piece in text])

    def summary(self, text: str) -> SummaryOutput:
        return SummaryOutput(summary="The caller asked about a transfer that had not arrived.")

    def topic(self, text: str) -> TopicOutput:
        return TopicOutput(topic="Transfer not arrived", matched_faq_number=2)

    def fields(self, text: str) -> FieldsOutput:
        return FieldsOutput(fields=[FieldOutput(label="Amount", value="800 euros", confidence=0.9, line_position=1)])

    def checks(self, text: str) -> CheckOutput:
        return CheckOutput(hand_off_expected=False, agent_repeated_personal_data=False, possible_mistake=False, reason="")

    def all(self) -> dict:
        return {MaskingOutput: self.masking, SummaryOutput: self.summary, TopicOutput: self.topic, FieldsOutput: self.fields, CheckOutput: self.checks}
