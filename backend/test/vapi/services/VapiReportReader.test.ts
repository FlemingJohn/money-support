import type { Clock } from "../../../src/common/services/Clock";
import { CallChannel, Speaker } from "../../../src/generated/prisma/client";
import { VapiCallMissingException } from "../../../src/vapi/exceptions/VapiCallMissingException";
import { VapiReportReader } from "../../../src/vapi/services/VapiReportReader";

describe("VapiReportReader", () => {
  const fixedNow = new Date("2026-11-03T10:00:00Z");
  const vapiReportReader = new VapiReportReader({ now: () => fixedNow } as Clock);

  it("reads the transcript and call details of a finished web call", () => {
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
    });
    expect(report.channel).toBe(CallChannel.web);
    expect(report.endedReason).toBe("assistant-ended-call");
    expect(report.endedAt).toBe(fixedNow);
    expect(report.lines).toEqual([
      { position: 0, speaker: Speaker.agent, text: "Hi there", secondsFromStart: 1 },
      { position: 1, speaker: Speaker.caller, text: "Where is my money?", secondsFromStart: 4 },
    ]);
  });

  it("reads the caller number of a phone call", () => {
    const report = vapiReportReader.read({
      type: "end-of-call-report",
      call: { id: "call-2", type: "inboundPhoneCall", customer: { number: "+14155557781" } },
    });
    expect(report.channel).toBe(CallChannel.phone);
    expect(report.customerNumber).toBe("+14155557781");
  });

  it("refuses a message without a call", () => {
    expect(() => vapiReportReader.read({ type: "end-of-call-report" })).toThrow(VapiCallMissingException);
  });
});
