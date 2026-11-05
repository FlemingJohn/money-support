import type { TestRunResponse } from "./TestRunResponse";

export interface LastTestRunResponse {
  run: TestRunResponse | null;
}
