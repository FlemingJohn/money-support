from app.common.models.CamelModel import CamelModel


class PrivacySettings(CamelModel):
    mask_card_numbers: bool
    mask_bank_account_numbers: bool
    mask_email_addresses: bool
    mask_names: bool
