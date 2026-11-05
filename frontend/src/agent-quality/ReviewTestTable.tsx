"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { reviewTestFilters } from "@/agent-quality/reviewTestFilters";
import { ReviewTestRow } from "@/agent-quality/ReviewTestRow";
import type { ReviewTestFilter } from "@/types/ReviewTestFilter";
import type { ReviewTestTableProps } from "@/types/ReviewTestTableProps";

const pageSize = 20;
const resultOrder = { failed: 0, notRun: 1, passed: 2 };

export function ReviewTestTable({ tests }: ReviewTestTableProps) {
  const [filter, setFilter] = useState<ReviewTestFilter>("all");
  const [query, setQuery] = useState("");
  const [shownCount, setShownCount] = useState(pageSize);
  const matches = reviewTestFilters.find((item) => item.filter === filter)?.matches ?? (() => true);
  const visible = tests
    .filter((test) => matches(test) && `${test.label} ${test.callerLine}`.toLowerCase().includes(query.trim().toLowerCase()))
    .sort((first, second) => resultOrder[first.lastResult] - resultOrder[second.lastResult]);

  return (
    <div className="flex flex-col border-t border-line-soft">
      <div className="flex flex-wrap items-center gap-2 px-5 py-3">
        {reviewTestFilters.map((item) => (
          <button key={item.filter} type="button" aria-pressed={filter === item.filter} onClick={() => setFilter(item.filter)} className={`inline-flex min-h-9 items-center gap-1.5 rounded-full px-3 text-sm font-semibold ${filter === item.filter ? "bg-yellow-soft" : "bg-sand hover:bg-line-soft"}`}>
            {item.label}
            <span className="text-ink-muted">{tests.filter(item.matches).length}</span>
          </button>
        ))}
        <label className="ml-auto flex min-h-9 min-w-0 flex-[0_1_240px] items-center gap-2 rounded-control border border-line bg-canvas px-2.5 text-ink-muted">
          <Search size={16} strokeWidth={1.75} aria-hidden="true" />
          <input type="search" aria-label="Search tests" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tests" className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none" />
        </label>
      </div>
      <ul aria-label="Tests from reviews" className="max-h-[60vh] overflow-y-auto border-t border-line-soft">
        {visible.slice(0, shownCount).map((test) => (
          <ReviewTestRow key={test.id} test={test} />
        ))}
      </ul>
      {visible.length > shownCount && (
        <button type="button" onClick={() => setShownCount((count) => count + pageSize)} className="min-h-11 border-t border-line-soft text-sm font-semibold hover:bg-surface">
          Show {Math.min(pageSize, visible.length - shownCount)} more
        </button>
      )}
    </div>
  );
}
