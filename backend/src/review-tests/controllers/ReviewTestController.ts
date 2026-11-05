import { Body, Controller, Get, HttpCode, Param, Patch, Post } from "@nestjs/common";
import { ReviewTestUpdateDto } from "../dto/ReviewTestUpdateDto";
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

  @Patch(":id")
  update(@Param("id") id: string, @Body() changes: ReviewTestUpdateDto): Promise<ReviewTestResponse> {
    return this.reviewTestService.setEnabled(id, changes.isEnabled);
  }

  @Post("run")
  @HttpCode(200)
  run(): Promise<TestRunResponse> {
    return this.reviewTestService.runAll();
  }
}
