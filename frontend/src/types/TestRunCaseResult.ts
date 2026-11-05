export interface TestRunCaseResult {
  caseId: string;
  name: string;
  status: "passed" | "failed" | "error";
  detail: string;
}
