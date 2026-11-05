import { Controller, Get, UseGuards } from "@nestjs/common";
import { ServiceSecretGuard } from "../../common/guards/ServiceSecretGuard";
import { ReviewTestService } from "../services/ReviewTestService";
import type { ReviewTestCase } from "../types/ReviewTestCase";

@Controller("internal/review-tests")
@UseGuards(ServiceSecretGuard)
export class InternalReviewTestController {
  constructor(private readonly reviewTestService: ReviewTestService) {}

  @Get()
  listEnabled(): Promise<ReviewTestCase[]> {
    return this.reviewTestService.listEnabledCases();
  }
}
