import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { VapiSecretGuard } from "../../common/guards/VapiSecretGuard";
import { VapiWebhookDto } from "../dto/VapiWebhookDto";
import { VapiWebhookService } from "../services/VapiWebhookService";
import type { WebhookReceipt } from "../responses/WebhookReceipt";

@Controller("vapi/webhook")
@UseGuards(VapiSecretGuard)
export class VapiWebhookController {
  constructor(private readonly vapiWebhookService: VapiWebhookService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async receive(@Body() body: VapiWebhookDto): Promise<WebhookReceipt> {
    await this.vapiWebhookService.dispatch(body.message);
    return { isReceived: true };
  }
}
