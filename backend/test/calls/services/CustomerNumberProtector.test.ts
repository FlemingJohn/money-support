import { randomBytes } from "node:crypto";
import { CustomerNumberProtector } from "../../../src/calls/services/CustomerNumberProtector";
import { EncryptionService } from "../../../src/common/EncryptionService";
import type { AppConfiguration } from "../../../src/configuration/AppConfiguration";

describe("CustomerNumberProtector", () => {
  const appConfiguration = { encryptionKey: randomBytes(32).toString("base64") } as AppConfiguration;
  const customerNumberProtector = new CustomerNumberProtector(new EncryptionService(appConfiguration));

  it("masks a US number to its last four digits", () => {
    expect(customerNumberProtector.protect("+14155557781", false)).toEqual({ masked: "+1 •••• 7781", encrypted: null });
  });

  it("masks a UK number with its country code", () => {
    expect(customerNumberProtector.protect("+442079460958", false).masked).toBe("+44 •••• 0958");
  });

  it("encrypts the full number only when asked and can reveal it", () => {
    const protectedNumber = customerNumberProtector.protect("+14155557781", true);
    expect(protectedNumber.encrypted).not.toContain("4155557781");
    expect(customerNumberProtector.reveal(protectedNumber.encrypted ?? "")).toBe("+14155557781");
  });

  it("returns nothing for a web call without a number", () => {
    expect(customerNumberProtector.protect(null, true)).toEqual({ masked: null, encrypted: null });
  });
});
