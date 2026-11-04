import { CallPagination } from "@/calls/CallPagination";
import { CallSearchForm } from "@/calls/CallSearchForm";
import { CallTable } from "@/calls/CallTable";
import { callPageSize, getCallPage } from "@/calls/getCallPage";
import { getOutcomeFilterOptions } from "@/calls/getOutcomeFilterOptions";
import { OutcomeFilterTabs } from "@/calls/OutcomeFilterTabs";
import { readCallFilter } from "@/calls/readCallFilter";
import { toCallRow } from "@/calls/toCallRow";
import type { SearchParamsProps } from "@/types/SearchParamsProps";

export async function CallsContent({ searchParams }: SearchParamsProps) {
  const filter = readCallFilter(await searchParams);
  const [callPage, filterOptions] = await Promise.all([getCallPage(filter), getOutcomeFilterOptions(filter)]);
  const emptyMessage = filter.search || filter.outcome ? "No calls match this filter." : "No calls yet. Calls appear here when they end.";

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <OutcomeFilterTabs options={filterOptions} filter={filter} />
        <CallSearchForm filter={filter} />
      </div>

      <section className="flex min-w-0 flex-1 flex-col rounded-card border border-line bg-paper">
        <div className="flex-1">
          <CallTable label="Calls" calls={callPage.calls.map(toCallRow)} emptyMessage={emptyMessage} />
        </div>
        <CallPagination filter={filter} total={callPage.total} pageSize={callPageSize} />
      </section>
    </>
  );
}
