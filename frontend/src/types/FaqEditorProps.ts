import type { Faq } from "@/types/Faq";

export interface FaqEditorProps {
  faq: Faq | null;
  categories: string[];
}
