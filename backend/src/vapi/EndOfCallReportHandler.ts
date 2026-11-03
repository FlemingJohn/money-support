import { Injectable } from "@nestjs/common";
import { CallRecordingService } from "./CallRecordingService";
import { VapiEventHandler } from "./VapiEventHandler";
import type { VapiMessage } from "./VapiMessage";

@Injectable()
export class EndOfCallReportHandler extends VapiEventHandler {
  readonly eventType = "end-of-call-report";

  constructor(private readonly callRecordingService: CallRecordingService) {
    super();
  }

  handle(message: VapiMessage): Promise<void> {
    return this.callRecordingService.recordFinishedCall(message);
  }
}
