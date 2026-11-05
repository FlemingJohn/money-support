import { agentQualityTabLinks } from "@/agent-quality/agentQualityTabLinks";
import { TabLinkBar } from "@/components/TabLinkBar";
import type { AgentQualityTabsProps } from "@/types/AgentQualityTabsProps";

export function AgentQualityTabs({ currentTab }: AgentQualityTabsProps) {
  const links = agentQualityTabLinks.map(({ tab, label, icon }) => ({ href: `/agent-quality?tab=${tab}`, label, icon, isCurrent: tab === currentTab }));
  return <TabLinkBar label="Agent quality sections" links={links} />;
}
