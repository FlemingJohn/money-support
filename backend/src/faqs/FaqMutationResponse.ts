import type { AgentSyncResponse } from "../assistant/AgentSyncResponse";
import type { FaqResponse } from "./FaqResponse";

export interface FaqMutationResponse {
  faq: FaqResponse;
  agentSync: AgentSyncResponse;
}
