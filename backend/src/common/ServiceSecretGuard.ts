import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import type { Request } from "express";
import { AppConfiguration } from "../configuration/services/AppConfiguration";
import { SecretMatcher } from "./SecretMatcher";

@Injectable()
export class ServiceSecretGuard implements CanActivate {
  constructor(
    private readonly secretMatcher: SecretMatcher,
    private readonly appConfiguration: AppConfiguration,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const isValid = this.secretMatcher.matches(request.header("x-service-secret"), this.appConfiguration.serviceSecret);
    if (!isValid) throw new UnauthorizedException("The service secret is missing or wrong");
    return true;
  }
}
