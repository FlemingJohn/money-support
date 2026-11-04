import { Module } from "@nestjs/common";
import { GuardrailsModule } from "../guardrails/GuardrailsModule";
import { SettingsModule } from "../settings/SettingsModule";
import { LineMaskingController } from "./controllers/LineMaskingController";
import { LineMaskingService } from "./services/LineMaskingService";
import { RequestRateLimiter } from "./services/RequestRateLimiter";

@Module({
  imports: [GuardrailsModule, SettingsModule],
  controllers: [LineMaskingController],
  providers: [LineMaskingService, RequestRateLimiter],
})
export class MaskingModule {}
