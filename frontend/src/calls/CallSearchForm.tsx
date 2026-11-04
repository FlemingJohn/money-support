import { Search } from "lucide-react";
import type { CallFilterProps } from "@/types/CallFilterProps";

export function CallSearchForm({ filter }: CallFilterProps) {
  return (
    <form action="/calls" role="search" className="flex min-w-60 flex-[0_1_360px] gap-2">
      {filter.outcome && <input type="hidden" name="outcome" value={filter.outcome} />}
      <label className="flex min-h-11 min-w-0 flex-1 items-center gap-2 rounded-control border border-line bg-paper px-3 text-ink-muted">
        <Search size={18} strokeWidth={1.75} className="shrink-0" aria-hidden="true" />
        <input
          type="search"
          name="search"
          defaultValue={filter.search}
          aria-label="Search by topic or call ID"
          placeholder="Search by topic or call ID"
          className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-muted"
        />
      </label>
      <button type="submit" className="min-h-11 rounded-control border border-line bg-paper px-4 text-sm font-semibold text-ink hover:bg-surface">
        Search
      </button>
    </form>
  );
}
