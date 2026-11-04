import { makeCallsPath } from "@/calls/makeCallsPath";
import { getFromBackend } from "@/lib/getFromBackend";
import type { CallFilter } from "@/types/CallFilter";
import type { CallPage } from "@/types/CallPage";
import type { OutcomeFilterOption } from "@/types/OutcomeFilterOption";

const choices: Omit<OutcomeFilterOption, "count">[] = [
  { label: "All", outcome: null },
  { label: "Resolved", outcome: "resolved" },
  { label: "Handed off", outcome: "handedOff" },
];

export function getOutcomeFilterOptions(filter: CallFilter): Promise<OutcomeFilterOption[]> {
  return Promise.all(choices.map((choice) => countCalls({ ...filter, outcome: choice.outcome, page: 1 }).then((count) => ({ ...choice, count }))));
}

async function countCalls(filter: CallFilter): Promise<number> {
  const page = await getFromBackend<CallPage>(makeCallsPath(filter, 1));
  return page.total;
}
