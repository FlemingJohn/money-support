import type { AgentSettingsDto } from "./AgentSettingsDto";
import type { HandOffSettingsDto } from "./HandOffSettingsDto";
import type { PhoneSettingsDto } from "./PhoneSettingsDto";
import type { PrivacySettingsDto } from "./PrivacySettingsDto";

export interface SettingsResponse {
  agent: AgentSettingsDto;
  handOff: HandOffSettingsDto;
  privacy: PrivacySettingsDto;
  phone: PhoneSettingsDto;
}
