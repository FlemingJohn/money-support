import { Module } from "@nestjs/common";
import { AppConfiguration } from "../configuration/services/AppConfiguration";
import { AiRedactionClient } from "./clients/AiRedactionClient";
import { GuardrailEventRepository } from "./repositories/GuardrailEventRepository";
import { PatternRedactionClient } from "./clients/PatternRedactionClient";
import { RedactionClient } from "./clients/RedactionClient";

@Module({
  providers: [
    GuardrailEventRepository,
    PatternRedactionClient,
    {
      provide: RedactionClient,
      inject: [AppConfiguration, PatternRedactionClient],
      useFactory: (appConfiguration: AppConfiguration, patternClient: PatternRedactionClient) =>
        appConfiguration.isAiServiceConfigured ? new AiRedactionClient(appConfiguration, patternClient) : patternClient,
    },
  ],
  exports: [GuardrailEventRepository, RedactionClient],
})
export class GuardrailsModule {}
