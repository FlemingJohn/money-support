"use client";

import { DataTable } from "@/components/DataTable";
import { callColumns } from "@/calls/callColumns";
import type { CallTableProps } from "@/types/CallTableProps";

export function CallTable({ calls, label, emptyMessage }: CallTableProps) {
  return <DataTable label={label} columns={callColumns} rows={calls} emptyMessage={emptyMessage} />;
}
