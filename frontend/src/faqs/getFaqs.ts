import { getFromBackend } from "@/lib/getFromBackend";
import type { Faq } from "@/types/Faq";

export function getFaqs(): Promise<Faq[]> {
  return getFromBackend<Faq[]>("/faqs");
}
