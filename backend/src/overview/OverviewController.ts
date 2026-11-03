import { Controller, Get } from "@nestjs/common";
import type { OverviewResponse } from "./OverviewResponse";
import { OverviewService } from "./OverviewService";

@Controller("overview")
export class OverviewController {
  constructor(private readonly overviewService: OverviewService) {}

  @Get()
  getOverview(): Promise<OverviewResponse> {
    return this.overviewService.getOverview();
  }
}
