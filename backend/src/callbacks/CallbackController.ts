import { Body, Controller, Get, Param, ParseUUIDPipe, Post } from "@nestjs/common";
import type { CallbackResponse } from "./CallbackResponse";
import { CallbackService } from "./CallbackService";
import { StartCallbackDto } from "./StartCallbackDto";

@Controller()
export class CallbackController {
  constructor(private readonly callbackService: CallbackService) {}

  @Post("reviews/:callId/callbacks")
  start(@Param("callId") callId: string, @Body() request: StartCallbackDto): Promise<CallbackResponse> {
    return this.callbackService.start(callId, request);
  }

  @Get("reviews/:callId/callbacks")
  listForCall(@Param("callId") callId: string): Promise<CallbackResponse[]> {
    return this.callbackService.listForCall(callId);
  }

  @Get("callbacks/:callbackId")
  refresh(@Param("callbackId", ParseUUIDPipe) callbackId: string): Promise<CallbackResponse> {
    return this.callbackService.refresh(callbackId);
  }

  @Post("callbacks/:callbackId/end")
  end(@Param("callbackId", ParseUUIDPipe) callbackId: string): Promise<CallbackResponse> {
    return this.callbackService.end(callbackId);
  }
}
