import { Body, Controller, Get, Param, Patch, Post, Put, Query } from "@nestjs/common";
import type { ReviewDetailResponse } from "./ReviewDetailResponse";
import { ReviewFilterDto } from "./ReviewFilterDto";
import type { ReviewListResponse } from "./ReviewListResponse";
import type { ReviewResponse } from "./ReviewResponse";
import { ReviewService } from "./ReviewService";
import { ReviewUpdateDto } from "./ReviewUpdateDto";
import { ReviewVerdictDto } from "./ReviewVerdictDto";

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
