class MaskKindCatalog:
    labels = {
        "name": "name",
        "card": "card number",
        "account": "bank account number",
        "email": "email address",
        "phone": "phone number",
        "address": "address",
    }

    @property
    def all_labels(self) -> list[str]:
        return list(self.labels.values())

    def get_label(self, kind: str) -> str:
        return self.labels.get(kind, "personal detail")

    def get_kinds_for(self, labels: list[str]) -> list[str]:
        return [kind for kind, label in self.labels.items() if label in labels]
