import Link from "next/link";
import { EmptyState } from "@/components/EmptyState";
import { FaqRowActions } from "@/faqs/FaqRowActions";
import type { FaqTableProps } from "@/types/FaqTableProps";

export function FaqTable({ faqs, selectedFaqId }: FaqTableProps) {
  if (faqs.length === 0) return <EmptyState message="No FAQs yet. Add one so the agent has something to answer." />;
  const orderedFaqIds = faqs.map((faq) => faq.id);

  return (
    <ul className="flex flex-col">
      {faqs.map((faq) => (
        <li key={faq.id} className={`grid min-h-16 grid-cols-[36px_minmax(0,1fr)_auto] items-center gap-3 border-b border-line-soft px-4 last:border-b-0 ${faq.id === selectedFaqId ? "bg-yellow-wash" : ""}`}>
          <span className={`grid size-7 place-items-center rounded-full font-mono text-xs font-bold ${faq.isActive ? "bg-yellow" : "bg-sand text-ink-muted"}`}>{faq.number}</span>
          <Link href={`/faqs?faq=${faq.id}`} className="flex min-w-0 flex-col py-2 text-ink hover:underline">
            <span className="truncate text-sm font-semibold">{faq.question}</span>
            <span className="text-xs text-ink-muted">
              {faq.category}
              {!faq.isActive && " · not used by the agent"}
            </span>
          </Link>
          <FaqRowActions faq={faq} orderedFaqIds={orderedFaqIds} />
        </li>
      ))}
    </ul>
  );
}
