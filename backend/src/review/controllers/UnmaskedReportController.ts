import { Body, Controller, HttpCode, HttpStatus, Param, Post } from "@nestjs/common";
import { UnmaskedReportDto } from "../dto/UnmaskedReportDto";
import { UnmaskedReportService } from "../services/UnmaskedReportService";

@Controller("calls/:callId/unmasked-reports")
export class UnmaskedReportController {
  constructor(private readonly unmaskedReportService: UnmaskedReportService) {}

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  report(@Param("callId") callId: string, @Body() report: UnmaskedReportDto): Promise<void> {
    return this.unmaskedReportService.report(callId, report.messageId);
  }
}
