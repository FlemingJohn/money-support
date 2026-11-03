import { Controller, Get, UseGuards } from "@nestjs/common";
import { ServiceSecretGuard } from "../../common/guards/ServiceSecretGuard";
import type { SettingsResponse } from "../responses/SettingsResponse";
import { SettingsService } from "../services/SettingsService";

@Controller("internal/settings")
@UseGuards(ServiceSecretGuard)
export class InternalSettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  getAll(): Promise<SettingsResponse> {
    return this.settingsService.getAll();
  }
}
