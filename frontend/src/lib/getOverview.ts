import { getFromBackend } from "@/lib/getFromBackend";
import type { Overview } from "@/types/Overview";

export function getOverview(): Promise<Overview> {
  return getFromBackend<Overview>("/overview");
}
