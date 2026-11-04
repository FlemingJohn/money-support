import type { Faq } from "@/types/Faq";

export interface FaqTableProps {
  faqs: Faq[];
  selectedFaqId: string | null;
}
