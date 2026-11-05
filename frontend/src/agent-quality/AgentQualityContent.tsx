import { AgentQualityTabs } from "@/agent-quality/AgentQualityTabs";
import { getLastTestRun } from "@/agent-quality/getLastTestRun";
import { getPromptRules } from "@/agent-quality/getPromptRules";
import { getReviewTests } from "@/agent-quality/getReviewTests";
import { getSuggestions } from "@/agent-quality/getSuggestions";
import { LearnedRulesPanel } from "@/agent-quality/LearnedRulesPanel";
import { readAgentQualityTab } from "@/agent-quality/readAgentQualityTab";
import { ReviewTestsPanel } from "@/agent-quality/ReviewTestsPanel";
import { SuggestionsPanel } from "@/agent-quality/SuggestionsPanel";
import type { AgentQualityTab } from "@/types/AgentQualityTab";
import type { SearchParamsProps } from "@/types/SearchParamsProps";

export async function AgentQualityContent({ searchParams }: SearchParamsProps) {
  const tab = readAgentQualityTab(await searchParams);

  return (
    <>
      <AgentQualityTabs currentTab={tab} />
      <section className="rounded-card border border-line bg-paper">{await renderPanel(tab)}</section>
    </>
  );
}

async function renderPanel(tab: AgentQualityTab) {
  if (tab === "suggestions") return <SuggestionsPanel suggestions={(await getSuggestions()).suggestions} />;
  if (tab === "rules") return <LearnedRulesPanel rules={(await getPromptRules()).rules} />;
  const [{ tests }, { run }] = await Promise.all([getReviewTests(), getLastTestRun()]);
  return <ReviewTestsPanel tests={tests} lastRun={run} />;
}
