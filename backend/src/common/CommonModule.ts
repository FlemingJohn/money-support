import { Global, Module } from "@nestjs/common";
import { Clock } from "./services/Clock";
import { CronSecretGuard } from "./guards/CronSecretGuard";
import { SecretMatcher } from "./services/SecretMatcher";
import { ServiceSecretGuard } from "./guards/ServiceSecretGuard";
import { VapiSecretGuard } from "./guards/VapiSecretGuard";

@Global()
@Module({
  providers: [Clock, SecretMatcher, CronSecretGuard, ServiceSecretGuard, VapiSecretGuard],
  exports: [Clock, SecretMatcher, CronSecretGuard, ServiceSecretGuard, VapiSecretGuard],
})
export class CommonModule {}
