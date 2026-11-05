import { Injectable } from "@nestjs/common";

@Injectable()
export class CustomerNumberMasker {
  mask(customerNumber: string | null): string | null {
    if (!customerNumber) return null;
    const digits = customerNumber.replace(/\D/g, "");
    const countryCode = digits.startsWith("1") ? "1" : digits.slice(0, 2);
    return `+${countryCode} •••• ${digits.slice(-4)}`;
  }
}
