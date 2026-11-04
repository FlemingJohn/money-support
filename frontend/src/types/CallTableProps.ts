import type { Call } from "@/types/Call";

export interface CallTableProps {
  calls: Call[];
  label: string;
  emptyMessage: string;
}
