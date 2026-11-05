import { CustomerNumberMasker } from "../../../src/calls/services/CustomerNumberMasker";

describe("CustomerNumberMasker", () => {
  const customerNumberMasker = new CustomerNumberMasker();

  it("masks a US number to its last four digits", () => {
    expect(customerNumberMasker.mask("+14155557781")).toBe("+1 •••• 7781");
  });

  it("masks a UK number with its country code", () => {
    expect(customerNumberMasker.mask("+442079460958")).toBe("+44 •••• 0958");
  });

  it("returns nothing for a web call without a number", () => {
    expect(customerNumberMasker.mask(null)).toBeNull();
  });
});
