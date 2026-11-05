import { Body, Controller, HttpCode, HttpStatus, Param, Post } from "@nestjs/common";
import { UnmaskedReportDto } from "../dto/UnmaskedReportDto";
import type { UnmaskedReportResponse } from "../responses/UnmaskedReportResponse";
import { UnmaskedReportService } from "../services/UnmaskedReportService";

@Controller("calls/:callId/unmasked-reports")
export class UnmaskedReportController {
  constructor(private readonly unmaskedReportService: UnmaskedReportService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  report(@Param("callId") callId: string, @Body() report: UnmaskedReportDto): Promise<UnmaskedReportResponse> {
    return this.unmaskedReportService.report(callId, report);
  }
}
