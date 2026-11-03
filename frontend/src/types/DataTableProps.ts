import type { ColumnDef, RowData } from "@tanstack/react-table";
import type { ListTableFeatures } from "@/types/ListTableFeatures";

export interface DataTableProps<Row extends RowData> {
  label: string;
  columns: ColumnDef<ListTableFeatures, Row>[];
  rows: Row[];
}
