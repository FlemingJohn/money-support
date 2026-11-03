import { Controller, Get, UseGuards } from "@nestjs/common";
import { ServiceSecretGuard } from "../../common/guards/ServiceSecretGuard";
import type { FaqResponse } from "../responses/FaqResponse";
import { FaqService } from "../services/FaqService";

@Controller("internal/faqs")
@UseGuards(ServiceSecretGuard)
export class InternalFaqController {
  constructor(private readonly faqService: FaqService) {}

  @Get()
  listActive(): Promise<FaqResponse[]> {
    return this.faqService.listActive();
  }
}
