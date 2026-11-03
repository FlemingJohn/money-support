import { Injectable } from "@nestjs/common";
import { EncryptionService } from "../common/EncryptionService";
import type { ProtectedCustomerNumber } from "./ProtectedCustomerNumber";

@Injectable()
export class CustomerNumberProtector {
  constructor(private readonly encryptionService: EncryptionService) {}

  protect(customerNumber: string | null, shouldKeepEncrypted: boolean): ProtectedCustomerNumber {
    if (!customerNumber) return { masked: null, encrypted: null };
    return {
      masked: this.mask(customerNumber),
      encrypted: shouldKeepEncrypted ? this.encryptionService.encrypt(customerNumber) : null,
    };
  }

  reveal(encryptedCustomerNumber: string): string {
    return this.encryptionService.decrypt(encryptedCustomerNumber);
  }

  private mask(customerNumber: string): string {
    const digits = customerNumber.replace(/\D/g, "");
    const countryCode = digits.startsWith("1") ? "1" : digits.slice(0, 2);
    return `+${countryCode} •••• ${digits.slice(-4)}`;
  }
}
