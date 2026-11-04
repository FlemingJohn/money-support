import { Module } from "@nestjs/common";
import { AppConfiguration } from "../configuration/services/AppConfiguration";
import { AiRedactionClient } from "./clients/AiRedactionClient";
import { GuardrailEventRepository } from "./repositories/GuardrailEventRepository";
import { MaskedEntityTypeResolver } from "./services/MaskedEntityTypeResolver";
import { PatternRedactionClient } from "./clients/PatternRedactionClient";
import { RedactionClient } from "./clients/RedactionClient";

@Module({
  providers: [
    GuardrailEventRepository,
    MaskedEntityTypeResolver,
    PatternRedactionClient,
    {
      provide: RedactionClient,
      inject: [AppConfiguration, PatternRedactionClient],
      useFactory: (appConfiguration: AppConfiguration, patternClient: PatternRedactionClient) =>
        appConfiguration.isAiServiceConfigured ? new AiRedactionClient(appConfiguration, patternClient) : patternClient,
    },
  ],
  exports: [GuardrailEventRepository, MaskedEntityTypeResolver, RedactionClient],
})
export class GuardrailsModule {}
