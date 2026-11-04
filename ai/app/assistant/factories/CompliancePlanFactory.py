from app.backend.models.PrivacySettings import PrivacySettings


class CompliancePlanFactory:
    card_number_pattern = r"\b(?:\d[ -]?){12,18}\d\b"
    bank_account_pattern = r"\b[A-Z]{2}\d{2}(?: ?[A-Z0-9]{4}){3,7}(?: ?[A-Z0-9]{1,3})?\b"
    mentioned_card_pattern = r"\b[Cc]ard\b[^0-9\n]{0,25}\d(?:[ -]?\d){2,}"
    mentioned_account_pattern = r"\b(?:[Aa]ccount|IBAN|[Ss]ort code)\b[^0-9\n]{0,25}\d(?:[ -]?\d){2,}"

    def make(self, privacy: PrivacySettings) -> dict:
        return {
            "securityFilterPlan": {
                "enabled": True,
                "filters": self.make_filters(privacy),
                "mode": "sanitize",
            }
        }

    def make_filters(self, privacy: PrivacySettings) -> list[dict]:
        filters = [{"type": "prompt-injection"}]
        if privacy.mask_card_numbers:
            filters.append({"type": "regex", "regex": self.card_number_pattern})
            filters.append({"type": "regex", "regex": self.mentioned_card_pattern})
        if privacy.mask_bank_account_numbers:
            filters.append({"type": "regex", "regex": self.bank_account_pattern})
            filters.append({"type": "regex", "regex": self.mentioned_account_pattern})
        return filters
