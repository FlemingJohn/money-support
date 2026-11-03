import { Global, Module } from "@nestjs/common";
import { Clock } from "./services/Clock";
import { CronSecretGuard } from "./guards/CronSecretGuard";
import { EncryptionService } from "./services/EncryptionService";
import { SecretMatcher } from "./services/SecretMatcher";
import { ServiceSecretGuard } from "./guards/ServiceSecretGuard";
import { VapiSecretGuard } from "./guards/VapiSecretGuard";

@Global()
@Module({
  providers: [Clock, EncryptionService, SecretMatcher, CronSecretGuard, ServiceSecretGuard, VapiSecretGuard],
  exports: [Clock, EncryptionService, SecretMatcher, CronSecretGuard, ServiceSecretGuard, VapiSecretGuard],
})
export class CommonModule {}
