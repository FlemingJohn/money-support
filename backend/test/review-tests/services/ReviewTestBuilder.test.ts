import { ReviewTestCheck, Speaker, VerdictReason, type CallMessage } from "../../../src/generated/prisma/client";
import { ReviewTestBuilder } from "../../../src/review-tests/services/ReviewTestBuilder";

describe("ReviewTestBuilder", () => {
  const builder = new ReviewTestBuilder();
  const messages = [
    { id: "m0", callId: "c", position: 0, speaker: Speaker.agent, redactedText: "Hi, how can I help?", secondsFromStart: 0 },
    { id: "m1", callId: "c", position: 1, speaker: Speaker.caller, redactedText: "When will my money arrive?", secondsFromStart: 2 },
    { id: "m2", callId: "c", position: 2, speaker: Speaker.agent, redactedText: "Under Home in your account.", secondsFromStart: 4 },
    { id: "m3", callId: "c", position: 3, speaker: Speaker.caller, redactedText: "What are your fees to India?", secondsFromStart: 8 },
    { id: "m4", callId: "c", position: 4, speaker: Speaker.agent, redactedText: "Fees are around one percent.", secondsFromStart: 10 },
  ] as CallMessage[];

  it("tests the caller line before the reply the reviewer picked", () => {
    const draft = builder.build(messages, { verdictReason: VerdictReason.shouldHaveHandedOff, expectedBehaviour: null, verdictMessageId: "m4" });
    expect(draft).toEqual({ callerLine: "What are your fees to India?", check: ReviewTestCheck.handsOff, expectation: "It hands the caller to a person instead of answering.", verdictReason: VerdictReason.shouldHaveHandedOff });
  });

  it("uses what the reviewer wrote as the expectation", () => {
    const draft = builder.build(messages, { verdictReason: VerdictReason.wrongInformation, expectedBehaviour: "Say the estimate is under Home.", verdictMessageId: "m2" });
    expect(draft).toMatchObject({ callerLine: "When will my money arrive?", check: ReviewTestCheck.answers, expectation: "Say the estimate is under Home." });
  });

  it("falls back to the last agent reply when none was picked", () => {
    expect(builder.build(messages, { verdictReason: VerdictReason.tooLongOrUnclear, expectedBehaviour: null, verdictMessageId: null })?.callerLine).toBe("What are your fees to India?");
  });

  it("makes no test when no caller spoke before the reply", () => {
    expect(builder.build(messages.slice(0, 1), { verdictReason: VerdictReason.tooLongOrUnclear, expectedBehaviour: null, verdictMessageId: "m0" })).toBeNull();
  });
});
