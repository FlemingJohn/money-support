import type { AgentSyncResponse } from "../../assistant/responses/AgentSyncResponse";
import type { FaqResponse } from "./FaqResponse";

export interface FaqListResponse {
  faqs: FaqResponse[];
  agentSync: AgentSyncResponse;
}
