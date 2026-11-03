import { Global, Module } from "@nestjs/common";
import { Clock } from "./services/Clock";
import { EncryptionService } from "./services/EncryptionService";
import { SecretMatcher } from "./services/SecretMatcher";
import { ServiceSecretGuard } from "./guards/ServiceSecretGuard";
import { VapiSecretGuard } from "./guards/VapiSecretGuard";

@Global()
@Module({
  providers: [Clock, EncryptionService, SecretMatcher, ServiceSecretGuard, VapiSecretGuard],
  exports: [Clock, EncryptionService, SecretMatcher, ServiceSecretGuard, VapiSecretGuard],
})
export class CommonModule {}
