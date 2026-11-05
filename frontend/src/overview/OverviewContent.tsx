import { BarChart3, Flag, Phone, PieChart } from "lucide-react";
import { CallTable } from "@/calls/CallTable";
import { CardLink } from "@/components/CardLink";
import { ChartLegendItem } from "@/components/ChartLegendItem";
import { SectionCard } from "@/components/SectionCard";
import { TabLinkBar } from "@/components/TabLinkBar";
import { getOverview } from "@/lib/getOverview";
import { getQuality } from "@/lib/getQuality";
import { AgentQualityCard } from "@/overview/AgentQualityCard";
import { CallVolumeChart } from "@/overview/CallVolumeChart";
import { HandOffReasonList } from "@/overview/HandOffReasonList";
import { makeOutcomeShares } from "@/overview/makeOutcomeShares";
import { makeOverviewPeriodLinks } from "@/overview/makeOverviewPeriodLinks";
import { makeOverviewStats } from "@/overview/makeOverviewStats";
import { NeedsReviewList } from "@/overview/NeedsReviewList";
import { OutcomeDonutChart } from "@/overview/OutcomeDonutChart";
import { OutcomeLegend } from "@/overview/OutcomeLegend";
import { OverviewStats } from "@/overview/OverviewStats";
import { overviewPeriodWordings } from "@/overview/overviewPeriodWordings";
import { readOverviewPeriod } from "@/overview/readOverviewPeriod";
import { toCallRow } from "@/calls/toCallRow";
import { toReviewPreview } from "@/overview/toReviewPreview";
import type { SearchParamsProps } from "@/types/SearchParamsProps";

export async function OverviewContent({ searchParams }: SearchParamsProps) {
  const period = readOverviewPeriod(await searchParams);
  const wording = overviewPeriodWordings[period];
  const [overview, quality] = await Promise.all([getOverview(period), getQuality()]);
  const outcomeShares = makeOutcomeShares(overview.current);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <TabLinkBar label="Overview period" links={makeOverviewPeriodLinks(period)} />
        <p className="text-sm text-ink-muted">Days counted in UK time</p>
      </div>

      <OverviewStats stats={makeOverviewStats(overview.current, overview.previous, wording)} />

      <div className="flex flex-wrap items-stretch gap-4">
        <SectionCard
          title={wording.chartTitle}
          icon={BarChart3}
          className="flex-[2_1_560px]"
          action={
            <span className="flex gap-4">
              <ChartLegendItem label="Resolved" color="yellow" />
              <ChartLegendItem label="Handed off" color="ink" />
            </span>
          }
        >
          <div className="flex flex-1 items-center p-5">
            <CallVolumeChart counts={overview.callVolume} label={wording.chartTitle} emptyMessage={wording.noCalls} />
          </div>
        </SectionCard>

        <SectionCard title="Outcomes" icon={PieChart} className="flex-[1_1_320px]">
          <div className="flex flex-1 flex-col gap-5 p-5">
            <div className="flex flex-wrap items-center justify-center gap-5">
              <OutcomeDonutChart shares={outcomeShares} />
              <OutcomeLegend shares={outcomeShares} />
            </div>
            <HandOffReasonList reasons={overview.handOffReasons} emptyMessage={wording.noHandOffs} />
          </div>
        </SectionCard>
      </div>

      <div className="flex flex-1 flex-wrap items-stretch gap-4">
        <SectionCard title="Recent calls" icon={Phone} className="flex-[2_1_560px]" action={<CardLink href="/calls" label="View all" />}>
          <CallTable label="Recent calls" calls={overview.recentCalls.map(toCallRow)} emptyMessage="No calls yet. Calls appear here when they end." />
        </SectionCard>

        <SectionCard title="Needs review" icon={Flag} className="flex-[1_1_320px]" action={<CardLink href="/review" label="Open queue" />}>
          <NeedsReviewList reviews={overview.needsReview.map(toReviewPreview)} />
        </SectionCard>
      </div>

      <AgentQualityCard quality={quality} />
    </>
  );
}
