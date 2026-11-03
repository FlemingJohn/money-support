import pytest
from presidio_anonymizer import AnonymizerEngine

from app.guardrails.catalogs.EntityLabelCatalog import EntityLabelCatalog
from app.guardrails.services.AnalyzerEngineFactory import AnalyzerEngineFactory
from app.guardrails.services.PersonalDataRedactor import PersonalDataRedactor


@pytest.fixture(scope="module")
def redactor() -> PersonalDataRedactor:
    return PersonalDataRedactor(AnalyzerEngineFactory().make(), AnonymizerEngine(), EntityLabelCatalog())


class PersonalDataRedactorTest:
    @pytest.mark.parametrize(
        ("text", "redacted_text"),
        [
            ("my card is 4111 1111 1111 1111", "my card is [card number removed]"),
            ("My IBAN is GB29 NWBK 6016 1331 9268 19", "My IBAN is [bank account number removed]"),
            ("write to priya@example.com", "write to [email address removed]"),
            ("call me on +44 7700 900123", "call me on [phone number removed]"),
            ("my account number is 12345678", "my account number is [bank account number removed]"),
            ("the sort code is 12-34-56", "the sort code is [sort code removed]"),
            ("Hi, I am Priya, card ending soon", "Hi, I am [name removed], card ending soon"),
            ("I'm Tom and my transfer is late", "I'm [name removed] and my transfer is late"),
        ],
    )
    def test_removes_personal_data(self, redactor: PersonalDataRedactor, text: str, redacted_text: str) -> None:
        assert redactor.redact_text(text).redacted_text == redacted_text

    def test_removes_names(self, redactor: PersonalDataRedactor) -> None:
        result = redactor.redact_text("Hi, this is Priya Shah calling")
        assert "Priya" not in result.redacted_text
        assert [entity.entity_type for entity in result.entities] == ["name"]

    @pytest.mark.parametrize(
        "text",
        [
            "I sent 500 pounds to Germany on Monday",
            "My transfer number is 123456789",
            "Why does it say my transfer's complete?",
            "I am worried, this is Wise right?",
        ],
    )
    def test_keeps_details_that_are_not_personal(self, redactor: PersonalDataRedactor, text: str) -> None:
        result = redactor.redact_text(text)
        assert result.redacted_text == text
        assert result.entities == []
