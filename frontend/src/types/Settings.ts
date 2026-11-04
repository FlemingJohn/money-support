import type { AgentSettings } from "@/types/AgentSettings";
import type { HandOffSettings } from "@/types/HandOffSettings";
import type { PhoneSettings } from "@/types/PhoneSettings";
import type { PrivacySettings } from "@/types/PrivacySettings";

export interface Settings {
  agent: AgentSettings;
  handOff: HandOffSettings;
  privacy: PrivacySettings;
  phone: PhoneSettings;
}
