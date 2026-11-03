import type { AgentSyncResponse } from "../assistant/AgentSyncResponse";
import type { FaqResponse } from "./FaqResponse";

export interface FaqListResponse {
  faqs: FaqResponse[];
  agentSync: AgentSyncResponse;
}
