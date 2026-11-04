import type { VoiceName } from "@/types/VoiceName";

export interface AgentSettings {
  assistantName: string;
  language: "en";
  greeting: string;
  voice: VoiceName;
  longestCallMinutes: number;
  silenceSeconds: number;
}
