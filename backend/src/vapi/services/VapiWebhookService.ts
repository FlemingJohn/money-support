import { Injectable } from "@nestjs/common";
import { EndOfCallReportHandler } from "../handlers/EndOfCallReportHandler";
import { StatusUpdateHandler } from "../handlers/StatusUpdateHandler";
import type { VapiEventHandler } from "../handlers/VapiEventHandler";
import type { VapiMessage } from "../types/VapiMessage";

@Injectable()
export class VapiWebhookService {
  private readonly handlersByEventType: Map<string, VapiEventHandler>;

  constructor(statusUpdateHandler: StatusUpdateHandler, endOfCallReportHandler: EndOfCallReportHandler) {
    const handlers: VapiEventHandler[] = [statusUpdateHandler, endOfCallReportHandler];
    this.handlersByEventType = new Map(handlers.map((handler) => [handler.eventType, handler]));
  }

  async dispatch(message: VapiMessage): Promise<void> {
    const handler = this.handlersByEventType.get(message.type);
    if (!handler) return;
    await handler.handle(message);
  }
}
