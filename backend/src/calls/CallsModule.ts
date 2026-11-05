import { Module } from "@nestjs/common";
import { ActivityModule } from "../activity/ActivityModule";
import { CallController } from "./controllers/CallController";
import { CallMessageRepository } from "./repositories/CallMessageRepository";
import { CallPresenter } from "./presenters/CallPresenter";
import { CallQueryService } from "./services/CallQueryService";
import { CallRepository } from "./repositories/CallRepository";
import { CustomerNumberMasker } from "./services/CustomerNumberMasker";
import { ExtractedFieldRepository } from "./repositories/ExtractedFieldRepository";

@Module({
  imports: [ActivityModule],
  controllers: [CallController],
  providers: [CallMessageRepository, CallPresenter, CallQueryService, CallRepository, CustomerNumberMasker, ExtractedFieldRepository],
  exports: [CallMessageRepository, CallPresenter, CallQueryService, CallRepository, CustomerNumberMasker, ExtractedFieldRepository],
})
export class CallsModule {}
