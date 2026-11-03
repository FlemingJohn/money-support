from presidio_analyzer import AnalyzerEngine
from presidio_anonymizer import AnonymizerEngine
from presidio_anonymizer.entities import OperatorConfig

from app.guardrails.catalogs.EntityLabelCatalog import EntityLabelCatalog
from app.guardrails.models.RedactedEntity import RedactedEntity
from app.guardrails.models.RedactionResult import RedactionResult


class PersonalDataRedactor:
    score_threshold = 0.4

    def __init__(self, analyzer: AnalyzerEngine, anonymizer: AnonymizerEngine, entity_label_catalog: EntityLabelCatalog) -> None:
        self.analyzer = analyzer
        self.anonymizer = anonymizer
        self.entity_label_catalog = entity_label_catalog

    def redact_texts(self, texts: list[str]) -> list[RedactionResult]:
        return [self.redact_text(text) for text in texts]

    def redact_text(self, text: str) -> RedactionResult:
        findings = self.analyzer.analyze(
            text=text,
            language="en",
            entities=self.entity_label_catalog.entity_types,
            score_threshold=self.score_threshold,
        )
        if not findings:
            return RedactionResult(redacted_text=text, entities=[])
        anonymized = self.anonymizer.anonymize(text=text, analyzer_results=findings, operators=self.make_operators())
        entities = [RedactedEntity(entity_type=self.entity_label_catalog.get_label(item.entity_type)) for item in anonymized.items]
        return RedactionResult(redacted_text=anonymized.text, entities=entities)

    def make_operators(self) -> dict[str, OperatorConfig]:
        return {
            entity_type: OperatorConfig("replace", {"new_value": self.entity_label_catalog.get_replacement(entity_type)})
            for entity_type in self.entity_label_catalog.entity_types
        }
