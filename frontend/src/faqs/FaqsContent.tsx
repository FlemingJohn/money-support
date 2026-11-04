import Link from "next/link";
import { BookOpen, Plus } from "lucide-react";
import { SectionCard } from "@/components/SectionCard";
import { FaqEditor } from "@/faqs/FaqEditor";
import { FaqTable } from "@/faqs/FaqTable";
import { getFaqs } from "@/faqs/getFaqs";
import { readFaqSelection } from "@/faqs/readFaqSelection";
import type { SearchParamsProps } from "@/types/SearchParamsProps";

export async function FaqsContent({ searchParams }: SearchParamsProps) {
  const selection = readFaqSelection(await searchParams);
  const faqs = await getFaqs();
  const selectedFaq = selection.kind === "existing" ? (faqs.find((faq) => faq.id === selection.faqId) ?? null) : null;
  const categories = [...new Set(faqs.map((faq) => faq.category))].sort();
  const activeCount = faqs.filter((faq) => faq.isActive).length;
  const isEditorOpen = selection.kind === "new" || selectedFaq !== null;

  return (
    <div className="flex flex-1 flex-wrap items-start gap-4">
      <SectionCard
        title={`${activeCount} of ${faqs.length} FAQs used by the agent`}
        icon={BookOpen}
        className="flex-[2_1_520px]"
        action={
          <Link href="/faqs?faq=new" className="inline-flex min-h-11 items-center gap-2 rounded-control bg-yellow px-4 text-sm font-semibold text-ink hover:bg-yellow-deep">
            <Plus size={16} strokeWidth={2} aria-hidden="true" />
            New FAQ
          </Link>
        }
      >
        <FaqTable faqs={faqs} selectedFaqId={selectedFaq?.id ?? null} />
      </SectionCard>

      {isEditorOpen ? (
        <FaqEditor key={selectedFaq?.id ?? "new"} faq={selectedFaq} categories={categories} />
      ) : (
        <aside className="flex min-w-0 flex-[1_1_360px] flex-col items-center gap-2 rounded-card border border-dashed border-line bg-paper p-10 text-center text-sm text-ink-muted">
          Pick an FAQ to edit it, or add a new one. Saving updates the agent straight away.
        </aside>
      )}
    </div>
  );
}
