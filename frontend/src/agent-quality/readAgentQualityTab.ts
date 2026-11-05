import type { AgentQualityTab } from "@/types/AgentQualityTab";

const tabs: AgentQualityTab[] = ["tests", "suggestions", "rules"];

export function readAgentQualityTab(searchParams: Record<string, string | string[] | undefined>): AgentQualityTab {
  const value = Array.isArray(searchParams.tab) ? searchParams.tab[0] : searchParams.tab;
  return tabs.find((tab) => tab === value) ?? "tests";
}
