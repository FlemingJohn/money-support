from app.analysis.models.AnalysisRequest import AnalysisRequest
from app.analysis.models.CallLine import CallLine
from app.analysis.services.HandOffDetector import HandOffDetector
from tests.support.SampleData import SampleData


class HandOffDetectorTest:
    detector = HandOffDetector()
    sentence = SampleData.hand_off_sentence

    def test_finds_the_sentence_with_a_curly_apostrophe(self) -> None:
        spoken = self.sentence.replace("'", "’")
        request = AnalysisRequest(call_id="c", hand_off_sentence=self.sentence, lines=[CallLine(position=0, speaker="agent", text=spoken)])
        assert self.detector.is_handed_off(request)

    def test_ignores_the_caller_saying_it(self) -> None:
        request = AnalysisRequest(call_id="c", hand_off_sentence=self.sentence, lines=[CallLine(position=0, speaker="caller", text=self.sentence)])
        assert not self.detector.is_handed_off(request)
