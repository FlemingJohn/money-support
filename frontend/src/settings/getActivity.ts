import { getFromBackend } from "@/lib/getFromBackend";
import type { ActivityEvent } from "@/types/ActivityEvent";

export function getActivity(): Promise<ActivityEvent[]> {
  return getFromBackend<ActivityEvent[]>("/activity?limit=50");
}
