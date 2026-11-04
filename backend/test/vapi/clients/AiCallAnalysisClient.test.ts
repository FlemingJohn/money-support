import type { AppConfiguration } from "../../../src/configuration/services/AppConfiguration";
import { ReviewReason, Speaker } from "../../../src/generated/prisma/client";
import { AiCallAnalysisClient } from "../../../src/vapi/clients/AiCallAnalysisClient";
import { PendingAnalysisBuilder } from "../../../src/vapi/services/PendingAnalysisBuilder";
import type { CallAnalysisInput } from "../../../src/vapi/types/CallAnalysisInput";

describe("AiCallAnalysisClient", () => {
  const appConfiguration = { aiServiceUrl: "http://ai.test", serviceSecret: "secret" } as AppConfiguration;
  const client = new AiCallAnalysisClient(appConfiguration, new PendingAnalysisBuilder());
  const input: CallAnalysisInput = {
    callId: "call-1",
    lines: [
      { position: 0, speaker: Speaker.agent, text: "Hi", secondsFromStart: 1 },
      { position: 1, speaker: Speaker.caller, text: "I am Ananya", secondsFromStart: 3 },
    ],
    endedReason: "assistant-ended-call",
    maskKinds: ["name"],
    faqs: [{ number: 2, question: "When will my money arrive?" }],
    handOffSentence: "I'm transferring you.",
  };

  afterEach(() => jest.restoreAllMocks());

  function answerWith(body: unknown, status = 200) {
    jest.spyOn(global, "fetch").mockResolvedValue(new Response(JSON.stringify(body), { status }));
  }

  it("uses the masked lines and analysis from ai/", async () => {
    answerWith({
      lines: [
        { position: 0, redactedText: "Hi", removedKinds: [], isChecked: true },
        { position: 1, redactedText: "I am [name removed]", removedKinds: ["name"], isChecked: true },
      ],
      summary: "Asked about a transfer.",
      topic: "Arrival",
      matchedFaqNumber: 2,
      isHandedOff: false,
      fields: [{ label: "Amount", value: "800 euros", confidence: 0.9 }],
      suggestedReview: { reason: "guardrail", note: "Personal data" },
      isComplete: true,
    });
    const analysis = await client.analyse(input);
    expect(analysis.lines[1]).toEqual({ position: 1, speaker: Speaker.caller, secondsFromStart: 3, redactedText: "I am [name removed]", removedEntityTypes: ["name"] });
    expect(analysis.matchedFaqNumber).toBe(2);
    expect(analysis.suggestedReviewReason).toBe(ReviewReason.guardrail);
    expect(analysis.isComplete).toBe(true);
  });

  it("never keeps raw text when ai/ could not check a line", async () => {
    answerWith({
      lines: [{ position: 1, redactedText: "[waiting for privacy check]", removedKinds: [], isChecked: false }],
      summary: null,
      topic: null,
      matchedFaqNumber: null,
      isHandedOff: false,
      fields: [],
      suggestedReview: null,
      isComplete: false,
    });
    const analysis = await client.analyse(input);
    expect(analysis.lines.map((line) => line.redactedText)).toEqual(["[waiting for privacy check]", "[waiting for privacy check]"]);
  });

  it("saves the call as waiting when ai/ is down", async () => {
    answerWith({ message: "down" }, 503);
    const analysis = await client.analyse(input);
    expect(analysis.isComplete).toBe(false);
    expect(analysis.lines.every((line) => line.redactedText === "[waiting for privacy check]")).toBe(true);
    expect(analysis.suggestedReviewReason).toBe(ReviewReason.guardrail);
  });
});
