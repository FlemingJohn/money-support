import type { PrivacySettings } from "@/types/PrivacySettings";

export function getMaskedEntityTypes(privacy: PrivacySettings): string[] {
  return [
    "phone number",
    ...(privacy.maskCardNumbers ? ["card number"] : []),
    ...(privacy.maskBankAccountNumbers ? ["bank account number", "sort code"] : []),
    ...(privacy.maskEmailAddresses ? ["email address"] : []),
  ];
}
