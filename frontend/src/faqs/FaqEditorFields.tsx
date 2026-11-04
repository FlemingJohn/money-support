import { Switch } from "@/components/Switch";
import { longestFaqAnswer } from "@/lib/longestFaqAnswer";
import type { FaqEditorFieldsProps } from "@/types/FaqEditorFieldsProps";

export function FaqEditorFields({ draft, categories, changeDraft }: FaqEditorFieldsProps) {
  const isAnswerTooLong = draft.answer.length > longestFaqAnswer;

  return (
    <>
      <label className="flex flex-col gap-1.5 text-sm font-semibold">
        Question
        <input value={draft.question} onChange={(event) => changeDraft({ question: event.target.value })} maxLength={300} className="min-h-11 rounded-control border border-line bg-paper px-3 font-normal" />
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-semibold">
        Category
        <input value={draft.category} onChange={(event) => changeDraft({ category: event.target.value })} list="faq-categories" maxLength={40} className="min-h-11 rounded-control border border-line bg-paper px-3 font-normal" />
        <datalist id="faq-categories">
          {categories.map((category) => (
            <option key={category} value={category} />
          ))}
        </datalist>
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-semibold">
        <span className="flex justify-between">
          Answer
          <span className={`font-mono text-xs font-normal ${isAnswerTooLong ? "text-handoff-ink" : "text-ink-muted"}`}>
            {draft.answer.length} / {longestFaqAnswer}
          </span>
        </span>
        <textarea value={draft.answer} onChange={(event) => changeDraft({ answer: event.target.value })} rows={9} className="rounded-control border border-line bg-paper px-3 py-2 font-normal leading-relaxed" />
        {isAnswerTooLong && <span className="text-xs font-normal text-handoff-ink">Keep the answer under 1,200 characters.</span>}
      </label>
      <div className="flex items-center justify-between gap-3 text-sm font-semibold">
        <span>Agent uses this FAQ</span>
        <Switch isOn={draft.isActive} label="Agent uses this FAQ" onToggle={() => changeDraft({ isActive: !draft.isActive })} />
      </div>
    </>
  );
}
