import type { EndOfCallReportHandler } from "../../../src/vapi/handlers/EndOfCallReportHandler";
import type { StatusUpdateHandler } from "../../../src/vapi/handlers/StatusUpdateHandler";
import { VapiWebhookService } from "../../../src/vapi/services/VapiWebhookService";

describe("VapiWebhookService", () => {
  const statusUpdateHandler = { eventType: "status-update", handle: jest.fn().mockResolvedValue(undefined) };
  const endOfCallReportHandler = { eventType: "end-of-call-report", handle: jest.fn().mockResolvedValue(undefined) };
  const vapiWebhookService = new VapiWebhookService(
    statusUpdateHandler as unknown as StatusUpdateHandler,
    endOfCallReportHandler as unknown as EndOfCallReportHandler,
  );

  beforeEach(() => jest.clearAllMocks());

  it("sends each event to the handler for its type", async () => {
    await vapiWebhookService.dispatch({ type: "end-of-call-report", call: { id: "call-1" } });
    expect(endOfCallReportHandler.handle).toHaveBeenCalledTimes(1);
    expect(statusUpdateHandler.handle).not.toHaveBeenCalled();
  });

  it("ignores event types it does not handle", async () => {
    await vapiWebhookService.dispatch({ type: "speech-update" });
    expect(statusUpdateHandler.handle).not.toHaveBeenCalled();
    expect(endOfCallReportHandler.handle).not.toHaveBeenCalled();
  });
});
