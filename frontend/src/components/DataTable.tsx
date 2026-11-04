"use client";

import { useTable, type RowData } from "@tanstack/react-table";
import { EmptyState } from "@/components/EmptyState";
import { listTableFeatures } from "@/lib/listTableFeatures";
import type { DataTableProps } from "@/types/DataTableProps";

export function DataTable<Row extends RowData>({ label, columns, rows, emptyMessage }: DataTableProps<Row>) {
  const table = useTable({ features: listTableFeatures, columns, data: rows });

  if (rows.length === 0) return <EmptyState message={emptyMessage} />;

  return (
    <div className="overflow-x-auto">
      <table aria-label={label} className="w-full min-w-150 table-fixed border-collapse text-sm">
        <thead className="bg-surface">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="border-b border-line-soft">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  scope="col"
                  style={{ width: header.column.columnDef.size }}
                  className="h-11 px-3 text-left text-xs font-semibold tracking-wide text-ink-muted uppercase first:pl-5 last:pr-5"
                >
                  {header.isPlaceholder ? null : <table.FlexRender header={header} />}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-b border-line-soft last:border-b-0">
              {row.getAllCells().map((cell) => (
                <td key={cell.id} className="h-13 truncate px-3 first:pl-5 last:pr-5">
                  <table.FlexRender cell={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
