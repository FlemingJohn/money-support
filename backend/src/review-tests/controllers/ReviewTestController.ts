import { Body, Controller, Get, HttpCode, Param, Patch, Post, Res } from "@nestjs/common";
import type { Response } from "express";
import { ReviewTestUpdateDto } from "../dto/ReviewTestUpdateDto";
import type { LastTestRunResponse } from "../responses/LastTestRunResponse";
import type { ReviewTestListResponse } from "../responses/ReviewTestListResponse";
import type { ReviewTestResponse } from "../responses/ReviewTestResponse";
import type { TestRunResponse } from "../responses/TestRunResponse";
import { ReviewTestService } from "../services/ReviewTestService";

@Controller("agent-quality/tests")
export class ReviewTestController {
  constructor(private readonly reviewTestService: ReviewTestService) {}

  @Get()
  list(): Promise<ReviewTestListResponse> {
    return this.reviewTestService.list();
  }

  @Get("last-run")
  getLastRun(): Promise<LastTestRunResponse> {
    return this.reviewTestService.getLastRun();
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() changes: ReviewTestUpdateDto): Promise<ReviewTestResponse> {
    return this.reviewTestService.setEnabled(id, changes.isEnabled);
  }

  @Post("run")
  @HttpCode(200)
  run(): Promise<TestRunResponse> {
    return this.reviewTestService.runAll();
  }

  @Post("run/stream")
  runStreaming(@Res() response: Response): Promise<void> {
    return this.reviewTestService.streamRun(response);
  }
}
