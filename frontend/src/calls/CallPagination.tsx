import { ChevronLeft, ChevronRight } from "lucide-react";
import { makeCallsPath } from "@/calls/makeCallsPath";
import { PageLink } from "@/components/PageLink";
import type { CallPaginationProps } from "@/types/CallPaginationProps";

export function CallPagination({ filter, total, pageSize }: CallPaginationProps) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const firstShown = total === 0 ? 0 : (filter.page - 1) * pageSize + 1;
  const lastShown = Math.min(filter.page * pageSize, total);

  return (
    <footer className="flex min-h-16 flex-wrap items-center justify-between gap-3 border-t border-line-soft px-5 py-2.5">
      <span className="text-sm text-ink-muted tabular-nums">
        Showing {firstShown}–{lastShown} of {total} calls
      </span>
      <div className="flex gap-2">
        <PageLink href={makeCallsPath({ ...filter, page: filter.page - 1 })} label="Previous page" isEnabled={filter.page > 1}>
          <ChevronLeft size={18} strokeWidth={2} aria-hidden="true" />
        </PageLink>
        <PageLink href={makeCallsPath({ ...filter, page: filter.page + 1 })} label="Next page" isEnabled={filter.page < pageCount}>
          <ChevronRight size={18} strokeWidth={2} aria-hidden="true" />
        </PageLink>
      </div>
    </footer>
  );
}
