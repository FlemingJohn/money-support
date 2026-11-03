import { Global, Module } from "@nestjs/common";
import { Clock } from "./Clock";
import { EncryptionService } from "./EncryptionService";
import { SecretMatcher } from "./SecretMatcher";
import { ServiceSecretGuard } from "./ServiceSecretGuard";
import { VapiSecretGuard } from "./VapiSecretGuard";

@Global()
@Module({
  providers: [Clock, EncryptionService, SecretMatcher, ServiceSecretGuard, VapiSecretGuard],
  exports: [Clock, EncryptionService, SecretMatcher, ServiceSecretGuard, VapiSecretGuard],
})
export class CommonModule {}
