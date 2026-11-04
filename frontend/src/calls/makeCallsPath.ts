import type { CallFilter } from "@/types/CallFilter";

export function makeCallsPath(filter: CallFilter, pageSize?: number): string {
  const query = new URLSearchParams();
  if (filter.outcome) query.set("outcome", filter.outcome);
  if (filter.search) query.set("search", filter.search);
  if (filter.page > 1) query.set("page", String(filter.page));
  if (pageSize) query.set("pageSize", String(pageSize));
  const queryText = query.toString();
  return queryText ? `/calls?${queryText}` : "/calls";
}
