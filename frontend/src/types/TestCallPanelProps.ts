import type { AgentSettings } from "@/types/AgentSettings";
import type { TestCallSetup } from "@/types/TestCallSetup";

export interface TestCallPanelProps {
  setup: TestCallSetup;
  agent: AgentSettings;
  faqQuestions: string[];
}
