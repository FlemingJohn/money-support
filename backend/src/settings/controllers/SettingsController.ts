import { Body, Controller, Get, Put } from "@nestjs/common";
import { AgentSettingsDto } from "../dto/AgentSettingsDto";
import { HandOffSettingsDto } from "../dto/HandOffSettingsDto";
import { PhoneSettingsDto } from "../dto/PhoneSettingsDto";
import { PrivacySettingsDto } from "../dto/PrivacySettingsDto";
import type { SettingsResponse } from "../responses/SettingsResponse";
import { SettingsService } from "../services/SettingsService";

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
