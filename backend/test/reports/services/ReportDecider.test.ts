import { ReportDecider } from "../../../src/reports/services/ReportDecider";

describe("ReportDecider", () => {
  const decider = new ReportDecider();
  const line = "My transfer to India is late. My account is 12345678.";

  it("masks only what the stricter re-check found", () => {
    const masking = { redactedText: "My transfer to India is late. My account is [bank account number removed].", removedKinds: ["bank account number"], isChecked: true };
    expect(decider.decide(line, masking, { messageId: "m", selectedText: "12345678", kind: "bank account number" })).toEqual({ text: masking.redactedText, kinds: ["bank account number"], outcome: "masked" });
  });

  it("masks the words the reviewer selected when the re-check finds nothing", () => {
    const masking = { redactedText: line, removedKinds: [], isChecked: true };
    const decision = decider.decide(line, masking, { messageId: "m", selectedText: "12345678", kind: "bank account number" });
    expect(decision).toEqual({ text: "My transfer to India is late. My account is [bank account number removed].", kinds: ["bank account number"], outcome: "masked" });
  });

  it("masks the selected words when the re-check could not run", () => {
    const decision = decider.decide(line, null, { messageId: "m", selectedText: "12345678", kind: "bank account number" });
    expect(decision.text).toBe("My transfer to India is late. My account is [bank account number removed].");
  });

  it("leaves the line unchanged when the words are not in it", () => {
    const masking = { redactedText: line, removedKinds: [], isChecked: true };
    expect(decider.decide(line, masking, { messageId: "m", selectedText: "87654321", kind: "bank account number" })).toEqual({ text: line, kinds: [], outcome: "unchanged" });
  });
});
