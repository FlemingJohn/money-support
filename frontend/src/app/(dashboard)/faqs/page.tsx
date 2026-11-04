import { Suspense } from "react";
import { PageLoading } from "@/components/PageLoading";
import { FaqsContent } from "@/faqs/FaqsContent";

export default function FaqsPage({ searchParams }: PageProps<"/faqs">) {
  return (
    <Suspense fallback={<PageLoading label="Loading FAQs" />}>
      <FaqsContent searchParams={searchParams} />
    </Suspense>
  );
}
