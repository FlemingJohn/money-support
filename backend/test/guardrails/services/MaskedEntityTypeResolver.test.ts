import { MaskedEntityTypeResolver } from "../../../src/guardrails/services/MaskedEntityTypeResolver";
import { PrivacySettingsDto } from "../../../src/settings/dto/PrivacySettingsDto";

describe("MaskedEntityTypeResolver", () => {
  const resolver = new MaskedEntityTypeResolver();

  it("masks every kind by default", () => {
    const privacy = PrivacySettingsDto.schema.parse({});
    expect(resolver.resolve(privacy)).toEqual(["phone number", "address", "card number", "bank account number", "email address", "name"]);
  });

  it("always masks phone numbers and addresses", () => {
    const privacy = PrivacySettingsDto.schema.parse({ maskCardNumbers: false, maskBankAccountNumbers: false, maskEmailAddresses: false, maskNames: false });
    expect(resolver.resolve(privacy)).toEqual(["phone number", "address"]);
  });
});
