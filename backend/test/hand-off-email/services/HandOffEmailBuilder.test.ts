import { HandOffEmailBuilder } from "../../../src/hand-off-email/services/HandOffEmailBuilder";
import type { HandOffEmailInput } from "../../../src/hand-off-email/types/HandOffEmailInput";

describe("HandOffEmailBuilder", () => {
  const builder = new HandOffEmailBuilder();
  const input: HandOffEmailInput = {
    to: "team@example.com",
    outcome: "transferNotAnswered",
    callId: "call-1",
    startedAt: new Date("2026-11-04T15:23:52Z"),
    endedAt: new Date("2026-11-04T15:25:09Z"),
    maskedCustomerNumber: "+91 ••••• ••363",
    topic: "Issue with bank account",
    summary: "The caller had a problem with their bank account.",
    lines: [
      { position: 0, speaker: "caller", redactedText: "My account is [bank account number removed] <b>", secondsFromStart: 1, removedEntityTypes: ["bank account number"] },
      { position: 1, speaker: "agent", redactedText: "Please contact the Wise support team.", secondsFromStart: 5, removedEntityTypes: [] },
    ],
    transferNumber: "+447700900123",
    callUrl: "https://dashboard.example.com/review?call=call-1",
  };

  it("names the case and the topic in the subject", () => {
    expect(builder.build(input).subject).toBe('⚠ Missed transfer, please call back: "Issue with bank account", 4 Nov 2026, 15:25');
  });

  it("explains the case with the transfer number and the call details", () => {
    const email = builder.build(input);
    expect(email.text).toContain("transfer this caller to +447700900123, but nobody answered");
    expect(email.text).toContain("When: 4 Nov 2026, 15:23 UK time, 77 seconds");
    expect(email.text).toContain("Caller: +91 ••••• ••363");
    expect(email.text).toContain("https://dashboard.example.com/review?call=call-1");
  });

  it("shows only the masked lines and escapes them in the html", () => {
    const email = builder.build(input);
    expect(email.text).toContain("Caller: My account is [bank account number removed]");
    expect(email.html).toContain("&lt;b&gt;");
  });
});
