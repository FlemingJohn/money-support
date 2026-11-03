import Link from "next/link";
import { createColumnHelper } from "@tanstack/react-table";
import { Clock, Flag, Hourglass, MessageSquare, User } from "lucide-react";
import { CallerLabel } from "@/components/CallerLabel";
import { ColumnHeading } from "@/components/ColumnHeading";
import { OutcomeChip } from "@/components/OutcomeChip";
import type { Call } from "@/types/Call";
import type { ListTableFeatures } from "@/types/ListTableFeatures";

const columnHelper = createColumnHelper<ListTableFeatures, Call>();

export const recentCallColumns = columnHelper.columns([
  columnHelper.display({
    id: "time",
    size: 84,
    header: () => <ColumnHeading icon={Clock} label="Time" />,
    cell: ({ row }) => <span className="font-mono text-[13px]">{row.original.time}</span>,
  }),
  columnHelper.display({
    id: "caller",
    size: 170,
    header: () => <ColumnHeading icon={User} label="Caller" />,
    cell: ({ row }) => <CallerLabel call={row.original} />,
  }),
  columnHelper.display({
    id: "length",
    size: 92,
    header: () => <ColumnHeading icon={Hourglass} label="Length" />,
    cell: ({ row }) => <span className="font-mono text-[13px]">{row.original.length}</span>,
  }),
  columnHelper.display({
    id: "topic",
    header: () => <ColumnHeading icon={MessageSquare} label="Topic" />,
    cell: ({ row }) => (
      <Link href={`/calls/${row.original.id}`} className="block truncate font-semibold text-ink hover:underline">
        {row.original.topic}
      </Link>
    ),
  }),
  columnHelper.display({
    id: "outcome",
    size: 144,
    header: () => <ColumnHeading icon={Flag} label="Outcome" />,
    cell: ({ row }) => <OutcomeChip outcome={row.original.outcome} />,
  }),
]);
