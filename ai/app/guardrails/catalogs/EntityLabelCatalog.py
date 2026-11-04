class EntityLabelCatalog:
    labels = {
        "PERSON": "name",
        "EMAIL_ADDRESS": "email address",
        "PHONE_NUMBER": "phone number",
        "CREDIT_CARD": "card number",
        "CARD_NUMBER": "card number",
        "IBAN_CODE": "bank account number",
        "BANK_ACCOUNT_NUMBER": "bank account number",
        "US_BANK_NUMBER": "bank account number",
        "SORT_CODE": "sort code",
    }

    @property
    def entity_types(self) -> list[str]:
        return list(self.labels)

    @property
    def all_labels(self) -> list[str]:
        return sorted(set(self.labels.values()))

    def get_entity_types_for(self, labels: list[str]) -> list[str]:
        return [entity_type for entity_type, label in self.labels.items() if label in labels]

    def get_label(self, entity_type: str) -> str:
        return self.labels.get(entity_type, "personal detail")

    def get_replacement(self, entity_type: str) -> str:
        return f"[{self.get_label(entity_type)} removed]"
