import { ReportDecider } from "../../../src/reports/services/ReportDecider";

describe("ReportDecider", () => {
  const decider = new ReportDecider();
  const line = "My transfer to India is late. My account is 12345678.";

  it("masks only what the stricter re-check found", () => {
    const masking = { redactedText: "My transfer to India is late. My account is [bank account number removed].", removedKinds: ["bank account number"], isChecked: true };
    expect(decider.decide(line, masking, { messageId: "m" })).toEqual({ text: masking.redactedText, kinds: ["bank account number"], outcome: "masked" });
  });

  it("masks the words the reviewer selected when the re-check finds nothing", () => {
    const masking = { redactedText: line, removedKinds: [], isChecked: true };
    const decision = decider.decide(line, masking, { messageId: "m", selectedText: "12345678", kind: "bank account number" });
    expect(decision).toEqual({ text: "My transfer to India is late. My account is [bank account number removed].", kinds: ["bank account number"], outcome: "masked" });
  });

  it("hides the line only as a last resort", () => {
    expect(decider.decide(line, null, { messageId: "m" })).toEqual({ text: "[message hidden while it is reviewed]", kinds: [], outcome: "hidden" });
  });
});
