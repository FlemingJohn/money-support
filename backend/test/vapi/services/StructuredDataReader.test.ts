import { StructuredDataReader } from "../../../src/vapi/services/StructuredDataReader";

describe("StructuredDataReader", () => {
  const structuredDataReader = new StructuredDataReader();

  it("keeps good values when one value is wrong", () => {
    const data = structuredDataReader.read({
      topic: "When money arrives",
      matchedFaqNumber: "two",
      isHandedOff: false,
      fields: [{ label: "Country", value: "Spain", confidence: 0.9 }],
    });
    expect(data).toEqual({ topic: "When money arrives", matchedFaqNumber: null, isHandedOff: false, fields: [{ label: "Country", value: "Spain", confidence: 0.9 }] });
  });

  it("reads zero as no matched FAQ", () => {
    expect(structuredDataReader.read({ topic: "Card fees", matchedFaqNumber: 0 }).matchedFaqNumber).toBeNull();
  });

  it("skips only the broken fields", () => {
    const { fields } = structuredDataReader.read({
      fields: [{ label: "Amount", value: "500 euros", confidence: 0.8 }, { label: "", value: "x", confidence: 0.5 }, "not a field"],
    });
    expect(fields).toEqual([{ label: "Amount", value: "500 euros", confidence: 0.8 }]);
  });

  it("turns a percentage confidence into a share", () => {
    const { fields } = structuredDataReader.read({ fields: [{ label: "Sent", value: "Monday", confidence: 85 }] });
    expect(fields[0].confidence).toBe(0.85);
  });

  it("returns empty data when nothing usable arrives", () => {
    expect(structuredDataReader.read("not an object")).toEqual({ topic: null, matchedFaqNumber: null, isHandedOff: null, fields: [] });
  });
});
