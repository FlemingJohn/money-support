import { BarChart3, Flag, Phone, PieChart } from "lucide-react";
import { CardLink } from "@/components/CardLink";
import { ChartLegendItem } from "@/components/ChartLegendItem";
import { SectionCard } from "@/components/SectionCard";
import { CallsPerHourChart } from "@/overview/CallsPerHourChart";
import { HandOffReasonList } from "@/overview/HandOffReasonList";
import { NeedsReviewList } from "@/overview/NeedsReviewList";
import { OutcomeDonutChart } from "@/overview/OutcomeDonutChart";
import { OutcomeLegend } from "@/overview/OutcomeLegend";
import { OverviewStats } from "@/overview/OverviewStats";
import { RecentCallsTable } from "@/overview/RecentCallsTable";
import { handOffReasons } from "@/sample/handOffReasons";
import { hourlyCallCounts } from "@/sample/hourlyCallCounts";
import { outcomeShares } from "@/sample/outcomeShares";
import { overviewStats } from "@/sample/overviewStats";
import { recentCalls } from "@/sample/recentCalls";
import { reviewPreviews } from "@/sample/reviewPreviews";

export default function OverviewPage() {
  return (
    <>
      <OverviewStats stats={overviewStats} />

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
            <CallsPerHourChart counts={hourlyCallCounts} />
          </div>
        </SectionCard>

        <SectionCard title="Outcomes" icon={PieChart} className="flex-[1_1_320px]">
          <div className="flex flex-1 flex-col gap-5 p-5">
            <div className="flex flex-wrap items-center justify-center gap-5">
              <OutcomeDonutChart shares={outcomeShares} />
              <OutcomeLegend shares={outcomeShares} />
            </div>
            <HandOffReasonList reasons={handOffReasons} />
          </div>
        </SectionCard>
      </div>

      <div className="flex flex-1 flex-wrap items-stretch gap-4">
        <SectionCard title="Recent calls" icon={Phone} className="flex-[2_1_560px]" action={<CardLink href="/calls" label="View all" />}>
          <RecentCallsTable calls={recentCalls} />
        </SectionCard>

        <SectionCard title="Needs review" icon={Flag} className="flex-[1_1_320px]" action={<CardLink href="/review" label="Open queue" />}>
          <NeedsReviewList reviews={reviewPreviews} />
        </SectionCard>
      </div>
    </>
  );
}
