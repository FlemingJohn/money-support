import Link from "next/link";
import { makeCallsPath } from "@/calls/makeCallsPath";
import type { OutcomeFilterTabsProps } from "@/types/OutcomeFilterTabsProps";

export function OutcomeFilterTabs({ options, filter }: OutcomeFilterTabsProps) {
  return (
    <nav aria-label="Filter by outcome" className="inline-flex flex-wrap gap-1 rounded-card border border-line bg-paper p-1">
      {options.map((option) => {
        const isPicked = option.outcome === filter.outcome;
        return (
          <Link
            key={option.label}
            href={makeCallsPath({ ...filter, outcome: option.outcome, page: 1 })}
            aria-current={isPicked ? "page" : undefined}
            className={`inline-flex min-h-10 items-center gap-2 whitespace-nowrap rounded-control px-3.5 text-sm font-semibold text-ink ${isPicked ? "bg-yellow-soft" : "hover:bg-surface"}`}
          >
            {option.label}
            <span className={`grid h-5.5 min-w-6 place-items-center rounded-full px-1.5 text-xs font-bold tabular-nums ${isPicked ? "bg-paper" : "bg-sand"}`}>
              {option.count}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
