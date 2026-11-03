import type { AgentSyncResponse } from "../../assistant/responses/AgentSyncResponse";
import type { FaqResponse } from "./FaqResponse";

export interface FaqMutationResponse {
  faq: FaqResponse;
  agentSync: AgentSyncResponse;
}
