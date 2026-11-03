import { Speaker } from "../../../src/generated/prisma/client";
import { PatternRedactionClient } from "../../../src/guardrails/clients/PatternRedactionClient";

describe("PatternRedactionClient", () => {
  const redactionClient = new PatternRedactionClient();

  async function redact(text: string) {
    const [line] = await redactionClient.redactLines([{ position: 0, speaker: Speaker.caller, text, secondsFromStart: 0 }]);
    return line;
  }

  it("removes a spaced card number", async () => {
    const line = await redact("My card is 4111 1111 1111 1111 thanks");
    expect(line.redactedText).toBe("My card is [card number removed] thanks");
    expect(line.removedEntityTypes).toEqual(["card number"]);
  });

  it("removes an IBAN", async () => {
    const line = await redact("Send it to GB29 NWBK 6016 1331 9268 19 please");
    expect(line.redactedText).toBe("Send it to [bank account number removed] please");
  });

  it("removes an email address and a phone number", async () => {
    const line = await redact("Email me at sam@example.com or call +44 20 7946 0958");
    expect(line.redactedText).toBe("Email me at [email address removed] or call [phone number removed]");
    expect(line.removedEntityTypes).toEqual(["email address", "phone number"]);
  });

  it("keeps ordinary amounts and times", async () => {
    const line = await redact("I sent $500 at 10:42 on Friday");
    expect(line.redactedText).toBe("I sent $500 at 10:42 on Friday");
    expect(line.removedEntityTypes).toEqual([]);
  });
});
