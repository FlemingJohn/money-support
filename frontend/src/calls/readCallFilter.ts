import type { CallFilter } from "@/types/CallFilter";
import type { CallOutcome } from "@/types/CallOutcome";

const outcomes: CallOutcome[] = ["resolved", "handedOff"];

export function readCallFilter(searchParams: Record<string, string | string[] | undefined>): CallFilter {
  const outcome = readFirst(searchParams.outcome);
  const page = Number.parseInt(readFirst(searchParams.page), 10);
  return {
    outcome: outcomes.find((known) => known === outcome) ?? null,
    search: readFirst(searchParams.search).trim().slice(0, 100),
    page: Number.isInteger(page) && page > 0 ? page : 1,
  };
}

function readFirst(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value) ?? "";
}
