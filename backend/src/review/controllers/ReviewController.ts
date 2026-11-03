import { Body, Controller, Get, Param, Patch, Post, Put, Query } from "@nestjs/common";
import type { ReviewDetailResponse } from "../responses/ReviewDetailResponse";
import { ReviewFilterDto } from "../dto/ReviewFilterDto";
import type { ReviewListResponse } from "../responses/ReviewListResponse";
import type { ReviewResponse } from "../responses/ReviewResponse";
import { ReviewService } from "../services/ReviewService";
import { ReviewUpdateDto } from "../dto/ReviewUpdateDto";
import { ReviewVerdictDto } from "../dto/ReviewVerdictDto";

@Controller("reviews")
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get()
  list(@Query() filter: ReviewFilterDto): Promise<ReviewListResponse> {
    return this.reviewService.list(filter.status);
  }

  @Get(":callId")
  getDetail(@Param("callId") callId: string): Promise<ReviewDetailResponse> {
    return this.reviewService.getDetail(callId);
  }

  @Patch(":callId")
  update(@Param("callId") callId: string, @Body() changes: ReviewUpdateDto): Promise<ReviewResponse> {
    return this.reviewService.update(callId, changes);
  }

  @Put(":callId/verdict")
  saveVerdict(@Param("callId") callId: string, @Body() verdict: ReviewVerdictDto): Promise<ReviewResponse> {
    return this.reviewService.saveVerdict(callId, verdict);
  }

  @Post(":callId/field-confirmations")
  confirmFields(@Param("callId") callId: string): Promise<ReviewDetailResponse> {
    return this.reviewService.confirmFields(callId);
  }
}
