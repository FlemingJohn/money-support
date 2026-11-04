import type { FaqDraft } from "@/types/FaqDraft";

export interface FaqEditorFieldsProps {
  draft: FaqDraft;
  categories: string[];
  changeDraft: (changes: Partial<FaqDraft>) => void;
}
