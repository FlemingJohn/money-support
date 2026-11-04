import { Injectable } from "@nestjs/common";
import type { PrivacySettingsDto } from "../../settings/dto/PrivacySettingsDto";

@Injectable()
export class MaskedEntityTypeResolver {
  resolve(privacy: PrivacySettingsDto): string[] {
    return [
      "phone number",
      ...(privacy.maskCardNumbers ? ["card number"] : []),
      ...(privacy.maskBankAccountNumbers ? ["bank account number", "sort code"] : []),
      ...(privacy.maskEmailAddresses ? ["email address"] : []),
      ...(privacy.maskNames ? ["name"] : []),
    ];
  }
}
