import type { CallAnalysis } from "../types/CallAnalysis";
import type { CallAnalysisInput } from "../types/CallAnalysisInput";

export abstract class CallAnalysisClient {
  abstract analyse(input: CallAnalysisInput): Promise<CallAnalysis>;
}
