import type { SettingsTab } from "@/types/SettingsTab";

const tabs: SettingsTab[] = ["agent", "handOff", "privacy", "phone", "connections", "activity"];

export function readSettingsTab(searchParams: Record<string, string | string[] | undefined>): SettingsTab {
  const value = Array.isArray(searchParams.tab) ? searchParams.tab[0] : searchParams.tab;
  return tabs.find((tab) => tab === value) ?? "agent";
}
