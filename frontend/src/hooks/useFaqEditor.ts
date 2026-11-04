"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useBackendChange } from "@/hooks/useBackendChange";
import { longestFaqAnswer } from "@/lib/longestFaqAnswer";
import type { AgentSync } from "@/types/AgentSync";
import type { Faq } from "@/types/Faq";
import type { FaqDraft } from "@/types/FaqDraft";
import type { FaqEditor } from "@/types/FaqEditor";
import type { FaqMutation } from "@/types/FaqMutation";

export function useFaqEditor(faq: Faq | null): FaqEditor {
  const router = useRouter();
  const { savingState, errorMessage, send } = useBackendChange();
  const [draft, setDraft] = useState<FaqDraft>(makeDraft(faq));
  const [agentSync, setAgentSync] = useState<AgentSync | null>(null);
  const isValid = draft.question.trim().length > 0 && draft.answer.trim().length > 0 && draft.category.trim().length > 0 && draft.answer.length <= longestFaqAnswer;

  function changeDraft(changes: Partial<FaqDraft>) {
    setDraft((current) => ({ ...current, ...changes }));
    setAgentSync(null);
  }

  async function save() {
    const result = faq ? await send<FaqMutation>("PATCH", `/faqs/${faq.id}`, draft) : await send<FaqMutation>("POST", "/faqs", draft);
    if (!result) return;
    setAgentSync(result.agentSync);
    if (!faq && result.faq) router.push(`/faqs?faq=${result.faq.id}`);
  }

  async function remove() {
    if (!faq) return;
    const result = await send<FaqMutation>("DELETE", `/faqs/${faq.id}`);
    if (result) router.push("/faqs");
  }

  return { draft, agentSync, savingState, errorMessage, isValid, changeDraft, save, remove };
}

function makeDraft(faq: Faq | null): FaqDraft {
  return { question: faq?.question ?? "", answer: faq?.answer ?? "", category: faq?.category ?? "", isActive: faq?.isActive ?? true };
}
