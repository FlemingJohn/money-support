import { Activity, ArrowLeftRight, AudioLines, Phone, PlugZap, ShieldCheck } from "lucide-react";
import type { SettingsTabLink } from "@/types/SettingsTabLink";

export const settingsTabLinks: SettingsTabLink[] = [
  { tab: "agent", label: "Agent", icon: AudioLines },
  { tab: "handOff", label: "Hand-off", icon: ArrowLeftRight },
  { tab: "privacy", label: "Privacy", icon: ShieldCheck },
  { tab: "phone", label: "Phone", icon: Phone },
  { tab: "connections", label: "Connections", icon: PlugZap },
  { tab: "activity", label: "Activity", icon: Activity },
];
