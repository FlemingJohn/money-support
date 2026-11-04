from presidio_analyzer import AnalyzerEngine
from presidio_anonymizer import AnonymizerEngine
from presidio_anonymizer.entities import OperatorConfig

from app.guardrails.catalogs.CommonWordCatalog import CommonWordCatalog
from app.guardrails.catalogs.EntityLabelCatalog import EntityLabelCatalog
from app.guardrails.models.RedactedEntity import RedactedEntity
from app.guardrails.models.RedactionResult import RedactionResult


class PersonalDataRedactor:
    score_threshold = 0.4

    def __init__(
        self,
        analyzer: AnalyzerEngine,
        anonymizer: AnonymizerEngine,
        entity_label_catalog: EntityLabelCatalog,
        common_word_catalog: CommonWordCatalog,
    ) -> None:
        self.analyzer = analyzer
        self.anonymizer = anonymizer
        self.entity_label_catalog = entity_label_catalog
        self.allowed_words = common_word_catalog.allowed_words

    def redact_texts(self, texts: list[str], labels: list[str]) -> list[RedactionResult]:
        entity_types = self.entity_label_catalog.get_entity_types_for(labels)
        return [self.redact_text(text, entity_types) for text in texts]

    def redact_text(self, text: str, entity_types: list[str]) -> RedactionResult:
        findings = self.find_personal_data(text, entity_types)
        if not findings:
            return RedactionResult(redacted_text=text, entities=[])
        anonymized = self.anonymizer.anonymize(text=text, analyzer_results=findings, operators=self.make_operators())
        entities = [RedactedEntity(entity_type=self.entity_label_catalog.get_label(item.entity_type)) for item in anonymized.items]
        return RedactionResult(redacted_text=anonymized.text, entities=entities)

    def find_personal_data(self, text: str, entity_types: list[str]) -> list:
        if not entity_types:
            return []
        return self.analyzer.analyze(
            text=text,
            language="en",
            entities=entity_types,
            score_threshold=self.score_threshold,
            allow_list=self.allowed_words,
        )

    def make_operators(self) -> dict[str, OperatorConfig]:
        return {
            entity_type: OperatorConfig("replace", {"new_value": self.entity_label_catalog.get_replacement(entity_type)})
            for entity_type in self.entity_label_catalog.entity_types
        }
