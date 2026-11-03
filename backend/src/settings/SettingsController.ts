import { Body, Controller, Get, Put } from "@nestjs/common";
import { AgentSettingsDto } from "./AgentSettingsDto";
import { HandOffSettingsDto } from "./HandOffSettingsDto";
import { PhoneSettingsDto } from "./PhoneSettingsDto";
import { PrivacySettingsDto } from "./PrivacySettingsDto";
import type { SettingsResponse } from "./SettingsResponse";
import { SettingsService } from "./SettingsService";

@Controller("settings")
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  getAll(): Promise<SettingsResponse> {
    return this.settingsService.getAll();
  }

  @Put("agent")
  updateAgent(@Body() values: AgentSettingsDto): Promise<SettingsResponse> {
    return this.settingsService.updateAgent(values);
  }

  @Put("hand-off")
  updateHandOff(@Body() values: HandOffSettingsDto): Promise<SettingsResponse> {
    return this.settingsService.updateHandOff(values);
  }

  @Put("privacy")
  updatePrivacy(@Body() values: PrivacySettingsDto): Promise<SettingsResponse> {
    return this.settingsService.updatePrivacy(values);
  }

  @Put("phone")
  updatePhone(@Body() values: PhoneSettingsDto): Promise<SettingsResponse> {
    return this.settingsService.updatePhone(values);
  }
}
