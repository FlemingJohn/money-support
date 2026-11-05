import { Controller, Get, Query } from "@nestjs/common";
import { OverviewQueryDto } from "../dto/OverviewQueryDto";
import type { OverviewResponse } from "../responses/OverviewResponse";
import type { QualityResponse } from "../responses/QualityResponse";
import { OverviewService } from "../services/OverviewService";

@Controller("overview")
export class OverviewController {
  constructor(private readonly overviewService: OverviewService) {}

  @Get()
  getOverview(@Query() query: OverviewQueryDto): Promise<OverviewResponse> {
    return this.overviewService.getOverview(query.period);
  }

  @Get("quality")
  getQuality(): Promise<QualityResponse> {
    return this.overviewService.getQuality();
  }
}
