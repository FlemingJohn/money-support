import type { AgentSettingsDto } from "../dto/AgentSettingsDto";
import type { HandOffSettingsDto } from "../dto/HandOffSettingsDto";
import type { PhoneSettingsDto } from "../dto/PhoneSettingsDto";
import type { PrivacySettingsDto } from "../dto/PrivacySettingsDto";

export interface SettingsResponse {
  agent: AgentSettingsDto;
  handOff: HandOffSettingsDto;
  privacy: PrivacySettingsDto;
  phone: PhoneSettingsDto;
}
