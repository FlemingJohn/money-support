import type { AgentSync } from "@/types/AgentSync";
import type { Faq } from "@/types/Faq";

export interface FaqMutation {
  faq?: Faq;
  faqs?: Faq[];
  agentSync: AgentSync;
}
