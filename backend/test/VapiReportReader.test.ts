import type { Clock } from "../src/common/services/Clock";
import { CallChannel, Speaker } from "../src/generated/prisma/client";
import { VapiCallMissingException } from "../src/vapi/VapiCallMissingException";
import { VapiReportReader } from "../src/vapi/VapiReportReader";

describe("VapiReportReader", () => {
  const fixedNow = new Date("2026-11-03T10:00:00Z");
  const vapiReportReader = new VapiReportReader({ now: () => fixedNow } as Clock);

  it("reads a finished web call with structured data", () => {
    const report = vapiReportReader.read({
      type: "end-of-call-report",
      call: { id: "call-1", type: "webCall" },
      endedReason: "assistant-ended-call",
      artifact: {
        messages: [
          { role: "system", message: "prompt" },
          { role: "bot", message: "Hi there", secondsFromStart: 1 },
          { role: "user", message: "Where is my money?", secondsFromStart: 4 },
          { role: "user", message: "   " },
        ],
      },
      analysis: { summary: "Asked about a transfer", structuredData: { topic: "Transfer status", matchedFaqNumber: 1, fields: [] } },
    });
    expect(report.channel).toBe(CallChannel.web);
    expect(report.isHandedOff).toBe(false);
    expect(report.matchedFaqNumber).toBe(1);
    expect(report.endedAt).toBe(fixedNow);
    expect(report.lines).toEqual([
      { position: 0, speaker: Speaker.agent, text: "Hi there", secondsFromStart: 1 },
      { position: 1, speaker: Speaker.caller, text: "Where is my money?", secondsFromStart: 4 },
    ]);
  });

  it("treats the end-call phrase as a hand-off when structured data is missing", () => {
    const report = vapiReportReader.read({
      type: "end-of-call-report",
      call: { id: "call-2", type: "inboundPhoneCall", customer: { number: "+14155557781" } },
      endedReason: "assistant-said-end-call-phrase",
      analysis: { structuredData: "not an object" },
    });
    expect(report.isHandedOff).toBe(true);
    expect(report.channel).toBe(CallChannel.phone);
    expect(report.customerNumber).toBe("+14155557781");
    expect(report.fields).toEqual([]);
  });

  it("refuses a message without a call", () => {
    expect(() => vapiReportReader.read({ type: "end-of-call-report" })).toThrow(VapiCallMissingException);
  });
});
