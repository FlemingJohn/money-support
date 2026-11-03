import { Injectable } from "@nestjs/common";
import { CallRecordingService } from "./CallRecordingService";
import { VapiEventHandler } from "./VapiEventHandler";
import type { VapiMessage } from "./VapiMessage";

@Injectable()
export class StatusUpdateHandler extends VapiEventHandler {
  readonly eventType = "status-update";

  constructor(private readonly callRecordingService: CallRecordingService) {
    super();
  }

  handle(message: VapiMessage): Promise<void> {
    return this.callRecordingService.recordCallStart(message);
  }
}
