import type { HandOffReason } from "@/types/HandOffReason";

export interface HandOffReasonListProps {
  reasons: HandOffReason[];
  emptyMessage: string;
}
