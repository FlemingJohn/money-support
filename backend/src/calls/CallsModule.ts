import { Module } from "@nestjs/common";
import { ActivityModule } from "../activity/ActivityModule";
import { CallController } from "./controllers/CallController";
import { CallMessageRepository } from "./repositories/CallMessageRepository";
import { CallPresenter } from "./presenters/CallPresenter";
import { CallQueryService } from "./services/CallQueryService";
import { CallRepository } from "./repositories/CallRepository";
import { CustomerNumberProtector } from "./services/CustomerNumberProtector";
import { ExtractedFieldRepository } from "./repositories/ExtractedFieldRepository";

@Module({
  imports: [ActivityModule],
  controllers: [CallController],
  providers: [CallMessageRepository, CallPresenter, CallQueryService, CallRepository, CustomerNumberProtector, ExtractedFieldRepository],
  exports: [CallMessageRepository, CallPresenter, CallQueryService, CallRepository, CustomerNumberProtector, ExtractedFieldRepository],
})
export class CallsModule {}
