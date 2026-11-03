import { Module } from "@nestjs/common";
import { AppConfiguration } from "../configuration/services/AppConfiguration";
import { AiRedactionClient } from "./AiRedactionClient";
import { GuardrailEventRepository } from "./GuardrailEventRepository";
import { PatternRedactionClient } from "./PatternRedactionClient";
import { RedactionClient } from "./RedactionClient";

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
