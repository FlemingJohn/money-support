import type { CallVolumeCount } from "@/types/CallVolumeCount";

export interface CallVolumeChartProps {
  counts: CallVolumeCount[];
  label: string;
  emptyMessage: string;
}
