import { makeCallsPath } from "@/calls/makeCallsPath";
import { getFromBackend } from "@/lib/getFromBackend";
import type { CallFilter } from "@/types/CallFilter";
import type { CallPage } from "@/types/CallPage";

export const callPageSize = 20;

export function getCallPage(filter: CallFilter): Promise<CallPage> {
  return getFromBackend<CallPage>(makeCallsPath(filter, callPageSize));
}
