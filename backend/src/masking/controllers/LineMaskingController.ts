import { Body, Controller, HttpCode, Ip, Post } from "@nestjs/common";
import { LineMaskingDto } from "../dto/LineMaskingDto";
import { TooManyMaskingRequestsException } from "../exceptions/TooManyMaskingRequestsException";
import type { LineMaskingResponse } from "../responses/LineMaskingResponse";
import { LineMaskingService } from "../services/LineMaskingService";
import { RequestRateLimiter } from "../services/RequestRateLimiter";

@Controller("masking")
export class LineMaskingController {
  constructor(
    private readonly lineMaskingService: LineMaskingService,
    private readonly requestRateLimiter: RequestRateLimiter,
  ) {}

  @Post("line")
  @HttpCode(200)
  mask(@Body() line: LineMaskingDto, @Ip() callerAddress: string): Promise<LineMaskingResponse> {
    if (!this.requestRateLimiter.isAllowed(callerAddress)) throw new TooManyMaskingRequestsException();
    return this.lineMaskingService.mask(line.text);
  }
}
