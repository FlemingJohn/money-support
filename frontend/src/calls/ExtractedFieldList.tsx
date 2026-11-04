import { Check, TriangleAlert } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import type { ExtractedFieldListProps } from "@/types/ExtractedFieldListProps";

const lowConfidence = 0.75;

export function ExtractedFieldList({ fields }: ExtractedFieldListProps) {
  if (fields.length === 0) return <EmptyState message="No details were picked out of this call." />;

  return (
    <ul className="flex flex-col">
      {fields.map((field) => {
        const isLow = field.confidence < lowConfidence && !field.isConfirmed;
        const confidence = `${Math.round(field.confidence * 100)}%`;
        return (
          <li key={field.id} className={`grid min-h-14 grid-cols-[26px_minmax(0,1fr)_96px] items-center gap-3 border-b border-line-soft px-5 py-2 last:border-b-0 ${isLow ? "bg-handoff-wash" : ""}`}>
            <span className="grid size-6 place-items-center rounded-full bg-yellow font-mono text-xs font-bold">{field.number}</span>
            <span className="flex min-w-0 flex-col">
              <span className="text-xs font-semibold text-ink-muted">{field.label}</span>
              <span className="truncate text-sm font-semibold">{field.value}</span>
            </span>
            <span className="flex flex-col items-end gap-1">
              <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold tabular-nums">
                {field.isConfirmed && <Check size={14} strokeWidth={2.2} aria-label="Confirmed" className="text-success-ink" />}
                {isLow && <TriangleAlert size={14} strokeWidth={2.2} aria-label="Low confidence" className="text-handoff-ink" />}
                {confidence}
              </span>
              <span className="h-1 w-18 overflow-hidden rounded-full bg-sand">
                <span className="block h-1 bg-ink" style={{ width: confidence }} />
              </span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}
