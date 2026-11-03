import { Search } from "lucide-react";

export function SearchField() {
  return (
    <label className="flex min-h-11 min-w-50 flex-[0_1_340px] items-center gap-2 rounded-control border border-line bg-canvas px-3 text-ink-muted">
      <Search size={18} strokeWidth={1.75} className="shrink-0" aria-hidden="true" />
      <input
        type="search"
        aria-label="Search calls and FAQs"
        placeholder="Search calls and FAQs"
        className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-muted"
      />
    </label>
  );
}
