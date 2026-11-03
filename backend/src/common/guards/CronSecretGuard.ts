import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import type { Request } from "express";
import { AppConfiguration } from "../../configuration/services/AppConfiguration";
import { SecretMatcher } from "../services/SecretMatcher";

@Injectable()
export class CronSecretGuard implements CanActivate {
  constructor(
    private readonly secretMatcher: SecretMatcher,
    private readonly appConfiguration: AppConfiguration,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const isValid = this.secretMatcher.matches(request.header("x-cron-secret"), this.appConfiguration.cronSecret);
    if (!isValid) throw new UnauthorizedException("The cron secret is missing or wrong");
    return true;
  }
}
