import type { TestScenario } from "@/types/TestScenario";

export interface TestScenarioGroup {
  title: string;
  scenarios: TestScenario[];
}
