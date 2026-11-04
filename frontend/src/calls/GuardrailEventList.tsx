import { ShieldCheck, TriangleAlert } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import type { GuardrailEventListProps } from "@/types/GuardrailEventListProps";

export function GuardrailEventList({ events }: GuardrailEventListProps) {
  if (events.length === 0) return <EmptyState message="No personal data was found in this call." />;

  return (
    <ul className="flex flex-col">
      {events.map((event) => {
        const isReport = event.kind === "unmaskedDataReported";
        const Icon = isReport ? TriangleAlert : ShieldCheck;
        return (
          <li key={event.id} className="flex items-center gap-2.5 border-b border-line-soft px-5 py-3 text-sm last:border-b-0">
            <span className={`grid size-8 shrink-0 place-items-center rounded-control ${isReport ? "bg-handoff-wash text-handoff-ink" : "bg-redacted-wash text-redacted-ink"}`}>
              <Icon size={16} strokeWidth={1.9} aria-hidden="true" />
            </span>
            <span className="min-w-0 first-letter:uppercase">
              <strong>{event.entityType}</strong> {isReport ? "reported as not masked" : "removed"}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
