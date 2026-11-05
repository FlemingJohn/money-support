import { Body, Controller, HttpCode, Post, UseGuards } from "@nestjs/common";
import { ServiceSecretGuard } from "../../common/guards/ServiceSecretGuard";
import { HandOffRingDto } from "../dto/HandOffRingDto";
import type { HandOffRingResponse } from "../responses/HandOffRingResponse";
import { HandOffRingService } from "../services/HandOffRingService";

@Controller("internal/hand-offs")
@UseGuards(ServiceSecretGuard)
export class HandOffRingController {
  constructor(private readonly handOffRingService: HandOffRingService) {}

  @Post("ring")
  @HttpCode(200)
  ring(@Body() request: HandOffRingDto): Promise<HandOffRingResponse> {
    return this.handOffRingService.ringTeam(request);
  }
}
