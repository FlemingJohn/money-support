"use client";

import { DataTable } from "@/components/DataTable";
import { recentCallColumns } from "@/overview/recentCallColumns";
import type { RecentCallsTableProps } from "@/types/RecentCallsTableProps";

export function RecentCallsTable({ calls }: RecentCallsTableProps) {
  return <DataTable label="Recent calls" columns={recentCallColumns} rows={calls} />;
}
