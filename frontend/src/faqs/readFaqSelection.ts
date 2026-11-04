import type { FaqSelection } from "@/types/FaqSelection";

export function readFaqSelection(searchParams: Record<string, string | string[] | undefined>): FaqSelection {
  const value = Array.isArray(searchParams.faq) ? searchParams.faq[0] : searchParams.faq;
  if (!value) return { kind: "none" };
  if (value === "new") return { kind: "new" };
  return { kind: "existing", faqId: value };
}
