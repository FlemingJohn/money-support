import pytest
from presidio_anonymizer import AnonymizerEngine

from app.guardrails.catalogs.CommonWordCatalog import CommonWordCatalog
from app.guardrails.catalogs.EntityLabelCatalog import EntityLabelCatalog
from app.guardrails.models.RedactionResult import RedactionResult
from app.guardrails.services.AnalyzerEngineFactory import AnalyzerEngineFactory
from app.guardrails.services.PersonalDataRedactor import PersonalDataRedactor

all_labels = EntityLabelCatalog().all_labels


@pytest.fixture(scope="module")
def redactor() -> PersonalDataRedactor:
    return PersonalDataRedactor(AnalyzerEngineFactory().make(), AnonymizerEngine(), EntityLabelCatalog(), CommonWordCatalog())


def redact(redactor: PersonalDataRedactor, text: str, labels: list[str] = all_labels) -> RedactionResult:
    return redactor.redact_texts([text], labels)[0]


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
        assert redact(redactor, text).redacted_text == redacted_text

    def test_removes_names(self, redactor: PersonalDataRedactor) -> None:
        result = redact(redactor, "Hi, this is Priya Shah calling")
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
        result = redact(redactor, text)
        assert result.redacted_text == text
        assert result.entities == []

    def test_does_not_mistake_everyday_words_for_names(self, redactor: PersonalDataRedactor) -> None:
        assert redact(redactor, "Email me at priya@example.com").redacted_text == "Email me at [email address removed]"

    def test_only_removes_the_chosen_kinds(self, redactor: PersonalDataRedactor) -> None:
        text = "I'm Tom, my card is 4111 1111 1111 1111"
        assert redact(redactor, text, ["card number"]).redacted_text == "I'm Tom, my card is [card number removed]"

    def test_removes_nothing_when_no_kinds_are_chosen(self, redactor: PersonalDataRedactor) -> None:
        text = "my card is 4111 1111 1111 1111"
        assert redact(redactor, text, []).redacted_text == text
