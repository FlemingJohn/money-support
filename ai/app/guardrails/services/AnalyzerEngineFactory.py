from presidio_analyzer import AnalyzerEngine, PatternRecognizer
from presidio_analyzer.nlp_engine import NlpEngine, NlpEngineProvider

from app.guardrails.recognizers.BankAccountRecognizer import BankAccountRecognizer
from app.guardrails.recognizers.CardNumberRecognizer import CardNumberRecognizer
from app.guardrails.recognizers.IntroducedNameRecognizer import IntroducedNameRecognizer
from app.guardrails.recognizers.MentionedAccountNumberRecognizer import MentionedAccountNumberRecognizer
from app.guardrails.recognizers.MentionedCardNumberRecognizer import MentionedCardNumberRecognizer
from app.guardrails.recognizers.PhoneNumberRecognizer import PhoneNumberRecognizer
from app.guardrails.recognizers.SortCodeRecognizer import SortCodeRecognizer


class AnalyzerEngineFactory:
    language = "en"

    def make(self) -> AnalyzerEngine:
        analyzer = AnalyzerEngine(nlp_engine=self.make_nlp_engine(), supported_languages=[self.language])
        for recognizer in self.make_recognizers():
            analyzer.registry.add_recognizer(recognizer)
        return analyzer

    def make_recognizers(self) -> list[PatternRecognizer]:
        return [
            CardNumberRecognizer(),
            BankAccountRecognizer(),
            SortCodeRecognizer(),
            PhoneNumberRecognizer(),
            IntroducedNameRecognizer(),
            MentionedCardNumberRecognizer(),
            MentionedAccountNumberRecognizer(),
        ]

    def make_nlp_engine(self) -> NlpEngine:
        provider = NlpEngineProvider(
            nlp_configuration={
                "nlp_engine_name": "spacy",
                "models": [{"lang_code": self.language, "model_name": "en_core_web_sm"}],
            }
        )
        return provider.create_engine()
