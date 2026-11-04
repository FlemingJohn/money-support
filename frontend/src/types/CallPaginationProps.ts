import type { CallFilter } from "@/types/CallFilter";

export interface CallPaginationProps {
  filter: CallFilter;
  total: number;
  pageSize: number;
}
