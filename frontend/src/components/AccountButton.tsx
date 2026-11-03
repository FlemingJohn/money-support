import { ChevronDown } from "lucide-react";

export function AccountButton() {
  return (
    <button
      type="button"
      aria-label="Account menu"
      className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-line bg-paper py-1 pr-2 pl-1 text-ink"
    >
      <span className="grid size-8.5 place-items-center rounded-full bg-ink text-[13px] font-bold text-yellow">AD</span>
      <ChevronDown size={16} strokeWidth={2} aria-hidden="true" />
    </button>
  );
}
