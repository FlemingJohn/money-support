import { Controller, HttpCode, Post, UseGuards } from "@nestjs/common";
import { CronSecretGuard } from "../../common/guards/CronSecretGuard";
import { RetentionService } from "../services/RetentionService";
import type { RetentionResult } from "../types/RetentionResult";

@Controller("internal/retention")
@UseGuards(CronSecretGuard)
export class RetentionController {
  constructor(private readonly retentionService: RetentionService) {}

  @Post("run")
  @HttpCode(200)
  run(): Promise<RetentionResult> {
    return this.retentionService.applyRetention();
  }
}
