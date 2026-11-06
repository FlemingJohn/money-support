import { EmptyState } from "@/components/EmptyState";
import { getFaqs } from "@/faqs/getFaqs";
import { getSettings } from "@/lib/getSettings";
import { TestCallPanel } from "@/test-call/TestCallPanel";

export async function TestCallContent() {
  const publicKey = process.env.VAPI_PUBLIC_KEY ?? "";
  const assistantId = process.env.VAPI_ASSISTANT_ID ?? "";
  const [settings, faqs] = await Promise.all([getSettings(), getFaqs()]);
  const faqQuestions = faqs.filter((faq) => faq.isActive).map((faq) => faq.question);

  if (!publicKey || !assistantId) {
    return (
      <section className="rounded-card border border-line bg-paper">
        <EmptyState message="Test calls need VAPI_PUBLIC_KEY and VAPI_ASSISTANT_ID in the frontend environment." />
      </section>
    );
  }

  return <TestCallPanel setup={{ publicKey, assistantId }} agent={settings.agent} faqQuestions={faqQuestions} />;
}
