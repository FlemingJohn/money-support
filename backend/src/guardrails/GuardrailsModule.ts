import { Module } from "@nestjs/common";
import { GuardrailEventRepository } from "./repositories/GuardrailEventRepository";
import { MaskedEntityTypeResolver } from "./services/MaskedEntityTypeResolver";

@Module({
  providers: [GuardrailEventRepository, MaskedEntityTypeResolver],
  exports: [GuardrailEventRepository, MaskedEntityTypeResolver],
})
export class GuardrailsModule {}
