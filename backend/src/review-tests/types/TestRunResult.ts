export interface TestRunResult {
  caseId: string;
  name: string;
  status: "passed" | "failed" | "error";
  detail: string;
}
