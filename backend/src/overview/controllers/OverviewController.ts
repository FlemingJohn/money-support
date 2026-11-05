import { Controller, Get } from "@nestjs/common";
import type { OverviewResponse } from "../responses/OverviewResponse";
import type { QualityResponse } from "../responses/QualityResponse";
import { OverviewService } from "../services/OverviewService";

@Controller("overview")
export class OverviewController {
  constructor(private readonly overviewService: OverviewService) {}

  @Get()
  getOverview(): Promise<OverviewResponse> {
    return this.overviewService.getOverview();
  }

  @Get("quality")
  getQuality(): Promise<QualityResponse> {
    return this.overviewService.getQuality();
  }
}
