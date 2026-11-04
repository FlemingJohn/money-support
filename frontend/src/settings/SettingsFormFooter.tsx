import type { SettingsFormFooterProps } from "@/types/SettingsFormFooterProps";

export function SettingsFormFooter({ hasChanged, savingState, errorMessage, saveLabel, onReset, onSave }: SettingsFormFooterProps) {
  return (
    <footer className="flex flex-wrap items-center justify-end gap-3 border-t border-line-soft pt-4">
      {savingState === "saved" && !hasChanged && <span role="status" className="text-sm text-success-ink">Saved</span>}
      {errorMessage && <span role="alert" className="text-sm text-handoff-ink">{errorMessage}</span>}
      <button type="button" onClick={onReset} disabled={!hasChanged} className="min-h-11 rounded-control border border-line px-4 text-sm font-semibold hover:bg-surface disabled:opacity-40">
        Cancel
      </button>
      <button type="button" onClick={onSave} disabled={!hasChanged || savingState === "saving"} className="min-h-11 rounded-control bg-ink px-4 text-sm font-semibold text-paper hover:bg-ink-muted disabled:opacity-40">
        {savingState === "saving" ? "Saving…" : saveLabel}
      </button>
    </footer>
  );
}
