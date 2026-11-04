import { verdictReasonLabels } from "@/lib/verdictReasonLabels";
import type { VerdictReason } from "@/types/VerdictReason";
import type { WrongVerdictDetailsProps } from "@/types/WrongVerdictDetailsProps";

export function WrongVerdictDetails({ verdictReason, expectedBehaviour, isSaving, onReasonChange, onExpectedBehaviourChange, onSave }: WrongVerdictDetailsProps) {
  return (
    <div className="flex flex-col gap-3 rounded-card border border-line-soft bg-surface p-3">
      <label className="flex flex-col gap-1.5 text-sm font-semibold">
        What went wrong?
        <select
          value={verdictReason}
          onChange={(event) => onReasonChange(event.target.value as VerdictReason)}
          className="min-h-11 rounded-control border border-line bg-paper px-3 font-normal"
        >
          {Object.entries(verdictReasonLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-semibold">
        What should it have done?
        <textarea
          value={expectedBehaviour}
          onChange={(event) => onExpectedBehaviourChange(event.target.value)}
          rows={2}
          maxLength={1000}
          className="rounded-control border border-line bg-paper px-3 py-2 font-normal"
        />
      </label>
      <button type="button" onClick={onSave} disabled={isSaving} className="min-h-11 self-end rounded-control bg-ink px-4 text-sm font-semibold text-paper hover:bg-ink-muted disabled:opacity-50">
        Save verdict
      </button>
    </div>
  );
}
