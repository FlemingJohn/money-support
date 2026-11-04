"use client";

import { ArrowDown, ArrowUp } from "lucide-react";
import { Switch } from "@/components/Switch";
import { useBackendChange } from "@/hooks/useBackendChange";
import type { FaqRowActionsProps } from "@/types/FaqRowActionsProps";

export function FaqRowActions({ faq, orderedFaqIds }: FaqRowActionsProps) {
  const { savingState, errorMessage, send } = useBackendChange();
  const position = orderedFaqIds.indexOf(faq.id);
  const isSaving = savingState === "saving";

  function move(offset: number) {
    const reordered = [...orderedFaqIds];
    [reordered[position], reordered[position + offset]] = [reordered[position + offset], reordered[position]];
    send("PUT", "/faqs/order", { faqIds: reordered });
  }

  return (
    <span className="flex items-center justify-end gap-1">
      {errorMessage && <span role="alert" className="sr-only">{errorMessage}</span>}
      <Switch
        isOn={faq.isActive}
        label={`Agent uses FAQ ${faq.number}`}
        isDisabled={isSaving}
        onToggle={() => send("PATCH", `/faqs/${faq.id}`, { isActive: !faq.isActive })}
      />
      <button type="button" onClick={() => move(-1)} disabled={isSaving || position === 0} aria-label={`Move FAQ ${faq.number} up`} className="grid size-11 place-items-center rounded-control text-ink-muted hover:bg-surface disabled:opacity-30">
        <ArrowUp size={16} strokeWidth={2} aria-hidden="true" />
      </button>
      <button type="button" onClick={() => move(1)} disabled={isSaving || position === orderedFaqIds.length - 1} aria-label={`Move FAQ ${faq.number} down`} className="grid size-11 place-items-center rounded-control text-ink-muted hover:bg-surface disabled:opacity-30">
        <ArrowDown size={16} strokeWidth={2} aria-hidden="true" />
      </button>
    </span>
  );
}
