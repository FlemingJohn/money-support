import type { SwitchProps } from "@/types/SwitchProps";

export function Switch({ isOn, label, isDisabled = false, onToggle }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isOn}
      aria-label={label}
      disabled={isDisabled}
      onClick={onToggle}
      className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full p-0.5 transition-colors disabled:opacity-50 ${isOn ? "bg-ink" : "bg-line"}`}
    >
      <span className={`size-6 rounded-full bg-paper shadow-sm transition-transform ${isOn ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  );
}
