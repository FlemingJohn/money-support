import { Module } from "@nestjs/common";
import { ActivityModule } from "../activity/ActivityModule";
import { CallController } from "./CallController";
import { CallMessageRepository } from "./CallMessageRepository";
import { CallPresenter } from "./CallPresenter";
import { CallQueryService } from "./CallQueryService";
import { CallRepository } from "./CallRepository";
import { CustomerNumberProtector } from "./CustomerNumberProtector";
import { ExtractedFieldRepository } from "./ExtractedFieldRepository";

@Module({
  imports: [ActivityModule],
  controllers: [CallController],
  providers: [CallMessageRepository, CallPresenter, CallQueryService, CallRepository, CustomerNumberProtector, ExtractedFieldRepository],
  exports: [CallMessageRepository, CallPresenter, CallQueryService, CallRepository, CustomerNumberProtector, ExtractedFieldRepository],
})
export class CallsModule {}
