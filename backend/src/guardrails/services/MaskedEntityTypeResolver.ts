import { Injectable } from "@nestjs/common";
import type { PrivacySettingsDto } from "../../settings/dto/PrivacySettingsDto";

@Injectable()
export class MaskedEntityTypeResolver {
  resolve(privacy: PrivacySettingsDto): string[] {
    return [
      "phone number",
      "address",
      ...(privacy.maskCardNumbers ? ["card number"] : []),
      ...(privacy.maskBankAccountNumbers ? ["bank account number"] : []),
      ...(privacy.maskEmailAddresses ? ["email address"] : []),
      ...(privacy.maskNames ? ["name"] : []),
    ];
  }
}
