import { getFromBackend } from "@/lib/getFromBackend";
import type { Settings } from "@/types/Settings";

export function getSettings(): Promise<Settings> {
  return getFromBackend<Settings>("/settings");
}
