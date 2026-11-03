import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Put } from "@nestjs/common";
import { CreateFaqDto } from "./CreateFaqDto";
import type { FaqListResponse } from "./FaqListResponse";
import type { FaqMutationResponse } from "./FaqMutationResponse";
import { FaqOrderDto } from "./FaqOrderDto";
import type { FaqResponse } from "./FaqResponse";
import { FaqService } from "./FaqService";
import { UpdateFaqDto } from "./UpdateFaqDto";

@Controller("faqs")
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @Get()
  list(): Promise<FaqResponse[]> {
    return this.faqService.list();
  }

  @Post()
  create(@Body() input: CreateFaqDto): Promise<FaqMutationResponse> {
    return this.faqService.create(input);
  }

  @Put("order")
  reorder(@Body() order: FaqOrderDto): Promise<FaqListResponse> {
    return this.faqService.reorder(order);
  }

  @Patch(":faqId")
  update(@Param("faqId", ParseUUIDPipe) faqId: string, @Body() changes: UpdateFaqDto): Promise<FaqMutationResponse> {
    return this.faqService.update(faqId, changes);
  }

  @Delete(":faqId")
  remove(@Param("faqId", ParseUUIDPipe) faqId: string): Promise<FaqListResponse> {
    return this.faqService.remove(faqId);
  }
}
