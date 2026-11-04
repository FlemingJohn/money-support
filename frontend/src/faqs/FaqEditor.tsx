"use client";

import Link from "next/link";
import { useState } from "react";
import { AgentSyncNotice } from "@/components/AgentSyncNotice";
import { FaqEditorFields } from "@/faqs/FaqEditorFields";
import { useFaqEditor } from "@/hooks/useFaqEditor";
import type { FaqEditorProps } from "@/types/FaqEditorProps";

export function FaqEditor({ faq, categories }: FaqEditorProps) {
  const { draft, agentSync, savingState, errorMessage, isValid, changeDraft, save, remove } = useFaqEditor(faq);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const isSaving = savingState === "saving";

  return (
    <aside aria-label="Edit FAQ" className="flex min-w-0 flex-[1_1_360px] flex-col rounded-card border border-line bg-paper">
      <header className="flex min-h-14 items-center border-b border-line-soft px-5">
        <h2 className="text-[15px] font-semibold">{faq ? `FAQ ${faq.number}` : "New FAQ"}</h2>
      </header>
      <div className="flex flex-col gap-4 p-5">
        <AgentSyncNotice agentSync={agentSync} />
        <FaqEditorFields draft={draft} categories={categories} changeDraft={changeDraft} />
        {errorMessage && <p role="alert" className="text-sm text-handoff-ink">{errorMessage}</p>}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line-soft pt-4">
          {faq ? (
            <button type="button" onClick={() => (isConfirmingDelete ? remove() : setIsConfirmingDelete(true))} disabled={isSaving} className="min-h-11 rounded-control px-3 text-sm font-semibold text-handoff-ink hover:bg-handoff-wash disabled:opacity-50">
              {isConfirmingDelete ? "Delete for good" : "Delete"}
            </button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <Link href="/faqs" className="inline-flex min-h-11 items-center rounded-control border border-line px-4 text-sm font-semibold text-ink hover:bg-surface">
              Cancel
            </Link>
            <button type="button" onClick={save} disabled={!isValid || isSaving} className="min-h-11 rounded-control bg-ink px-4 text-sm font-semibold text-paper hover:bg-ink-muted disabled:opacity-40">
              {isSaving ? "Saving…" : "Save and update agent"}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
