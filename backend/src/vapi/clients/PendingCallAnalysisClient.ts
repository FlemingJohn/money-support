import { Injectable } from "@nestjs/common";
import { PendingAnalysisBuilder } from "../services/PendingAnalysisBuilder";
import type { CallAnalysis } from "../types/CallAnalysis";
import type { CallAnalysisInput } from "../types/CallAnalysisInput";
import { CallAnalysisClient } from "./CallAnalysisClient";

@Injectable()
export class PendingCallAnalysisClient extends CallAnalysisClient {
  constructor(private readonly pendingAnalysisBuilder: PendingAnalysisBuilder) {
    super();
  }

  async analyse(input: CallAnalysisInput): Promise<CallAnalysis> {
    return this.pendingAnalysisBuilder.build(input);
  }
}
