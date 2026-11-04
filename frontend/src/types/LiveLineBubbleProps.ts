import type { LineMaskingResult } from "@/types/LineMaskingResult";
import type { LiveLine } from "@/types/LiveLine";

export interface LiveLineBubbleProps {
  line: LiveLine;
  masking: LineMaskingResult | undefined;
}
