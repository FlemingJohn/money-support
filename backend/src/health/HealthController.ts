import { Controller, Get } from "@nestjs/common";
import type { HealthResponse } from "./HealthResponse";
import { HealthService } from "./HealthService";

@Controller("health")
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  check(): Promise<HealthResponse> {
    return this.healthService.check();
  }
}
