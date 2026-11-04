import Link from "next/link";
import { makeReviewPath } from "@/review/makeReviewPath";
import type { ReviewStatusTab } from "@/types/ReviewStatusTab";
import type { ReviewStatusTabsProps } from "@/types/ReviewStatusTabsProps";

const tabs: ReviewStatusTab[] = [
  { status: "open", label: "Open" },
  { status: "inProgress", label: "In progress" },
  { status: "done", label: "Done" },
];

export function ReviewStatusTabs({ counts, selection }: ReviewStatusTabsProps) {
  return (
    <nav aria-label="Filter by status" className="grid grid-cols-3 gap-1 border-b border-line-soft p-2">
      {tabs.map((tab) => {
        const isPicked = tab.status === selection.status;
        return (
          <Link
            key={tab.status}
            href={makeReviewPath({ status: tab.status, callId: null })}
            aria-current={isPicked ? "page" : undefined}
            className={`flex min-h-10 items-center justify-center gap-1.5 rounded-control px-2 text-[13px] font-semibold text-ink ${isPicked ? "bg-yellow-soft" : "hover:bg-surface"}`}
          >
            <span className="truncate">{tab.label}</span>
            <span className={`grid h-5 min-w-5.5 place-items-center rounded-full px-1.5 text-xs font-bold tabular-nums ${isPicked ? "bg-paper" : "bg-sand"}`}>
              {counts[tab.status]}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
