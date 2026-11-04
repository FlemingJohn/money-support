import type { HandOffModePickerProps } from "@/types/HandOffModePickerProps";

const modes = [
  { mode: "endCall", title: "Say the hand-off sentence and end the call", detail: "A person follows up from the review queue." },
  { mode: "transfer", title: "Transfer to a phone number", detail: "The caller is connected to a person straight away." },
] as const;

export function HandOffModePicker({ mode, onChange }: HandOffModePickerProps) {
  return (
    <fieldset className="flex flex-col gap-2 border-b border-line-soft py-4">
      <legend className="mb-2 text-sm font-semibold">When a question is out of scope</legend>
      <div className="flex flex-wrap gap-2">
        {modes.map((choice) => (
          <label key={choice.mode} className={`flex min-w-0 flex-[1_1_260px] cursor-pointer items-start gap-3 rounded-card border p-3.5 ${mode === choice.mode ? "border-ink bg-yellow-wash" : "border-line hover:bg-surface"}`}>
            <input type="radio" name="hand-off-mode" checked={mode === choice.mode} onChange={() => onChange(choice.mode)} className="mt-1 size-4 accent-ink" />
            <span className="flex flex-col gap-0.5">
              <strong className="text-sm">{choice.title}</strong>
              <span className="text-[13px] text-ink-muted">{choice.detail}</span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
