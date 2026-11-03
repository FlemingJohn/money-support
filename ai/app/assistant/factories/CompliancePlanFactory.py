from app.backend.models.PrivacySettings import PrivacySettings


class CompliancePlanFactory:
    card_number_pattern = r"\b(?:\d[ -]?){12,18}\d\b"
    bank_account_pattern = r"\b[A-Z]{2}\d{2}(?: ?[A-Z0-9]{4}){3,7}(?: ?[A-Z0-9]{1,3})?\b"

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
        if privacy.mask_bank_account_numbers:
            filters.append({"type": "regex", "regex": self.bank_account_pattern})
        return filters
