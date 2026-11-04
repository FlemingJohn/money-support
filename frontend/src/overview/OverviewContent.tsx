import { BarChart3, Flag, Phone, PieChart } from "lucide-react";
import { CardLink } from "@/components/CardLink";
import { ChartLegendItem } from "@/components/ChartLegendItem";
import { SectionCard } from "@/components/SectionCard";
import { getOverview } from "@/lib/getOverview";
import { CallsPerHourChart } from "@/overview/CallsPerHourChart";
import { HandOffReasonList } from "@/overview/HandOffReasonList";
import { makeOutcomeShares } from "@/overview/makeOutcomeShares";
import { makeOverviewStats } from "@/overview/makeOverviewStats";
import { NeedsReviewList } from "@/overview/NeedsReviewList";
import { OutcomeDonutChart } from "@/overview/OutcomeDonutChart";
import { OutcomeLegend } from "@/overview/OutcomeLegend";
import { OverviewStats } from "@/overview/OverviewStats";
import { RecentCallsTable } from "@/overview/RecentCallsTable";
import { toRecentCall } from "@/overview/toRecentCall";
import { toReviewPreview } from "@/overview/toReviewPreview";

export async function OverviewContent() {
  const overview = await getOverview();
  const outcomeShares = makeOutcomeShares(overview.today);

  return (
    <>
      <OverviewStats stats={makeOverviewStats(overview.today, overview.yesterday)} />

      <div className="flex flex-wrap items-stretch gap-4">
        <SectionCard
          title="Calls per hour"
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
            <CallsPerHourChart counts={overview.callsPerHour} />
          </div>
        </SectionCard>

        <SectionCard title="Outcomes" icon={PieChart} className="flex-[1_1_320px]">
          <div className="flex flex-1 flex-col gap-5 p-5">
            <div className="flex flex-wrap items-center justify-center gap-5">
              <OutcomeDonutChart shares={outcomeShares} />
              <OutcomeLegend shares={outcomeShares} />
            </div>
            <HandOffReasonList reasons={overview.handOffReasons} />
          </div>
        </SectionCard>
      </div>

      <div className="flex flex-1 flex-wrap items-stretch gap-4">
        <SectionCard title="Recent calls" icon={Phone} className="flex-[2_1_560px]" action={<CardLink href="/calls" label="View all" />}>
          <RecentCallsTable calls={overview.recentCalls.map(toRecentCall)} />
        </SectionCard>

        <SectionCard title="Needs review" icon={Flag} className="flex-[1_1_320px]" action={<CardLink href="/review" label="Open queue" />}>
          <NeedsReviewList reviews={overview.needsReview.map(toReviewPreview)} />
        </SectionCard>
      </div>
    </>
  );
}
