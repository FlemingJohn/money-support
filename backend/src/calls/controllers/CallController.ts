import { Controller, Get, Param, Query } from "@nestjs/common";
import type { CallDetailResponse } from "../responses/CallDetailResponse";
import { CallFilterDto } from "../dto/CallFilterDto";
import type { CallPageResponse } from "../responses/CallPageResponse";
import { CallQueryService } from "../services/CallQueryService";

@Controller("calls")
export class CallController {
  constructor(private readonly callQueryService: CallQueryService) {}

  @Get()
  getPage(@Query() filter: CallFilterDto): Promise<CallPageResponse> {
    return this.callQueryService.getPage(filter);
  }

  @Get(":callId")
  getDetail(@Param("callId") callId: string): Promise<CallDetailResponse> {
    return this.callQueryService.getDetail(callId);
  }
}
