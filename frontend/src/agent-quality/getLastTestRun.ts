import { getFromBackend } from "@/lib/getFromBackend";
import type { LastTestRun } from "@/types/LastTestRun";

export function getLastTestRun(): Promise<LastTestRun> {
  return getFromBackend<LastTestRun>("/agent-quality/tests/last-run");
}
