import type { StepStatusIconProps } from "@/types/StepStatusIconProps";

export function StepStatusIcon({ status }: StepStatusIconProps) {
  if (status === "done") {
    return (
      <svg viewBox="0 0 22 22" width="22" height="22" role="img" aria-label="Done">
        <circle cx="11" cy="11" r="10" className="fill-success-wash stroke-success" strokeWidth="1.5" />
        <path d="M6.5 11.5 L9.5 14.5 L15.5 8" fill="none" className="stroke-success" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (status === "active") {
    return (
      <svg viewBox="0 0 22 22" width="22" height="22" role="img" aria-label="Working" className="animate-spin">
        <circle cx="11" cy="11" r="9" fill="none" className="stroke-line" strokeWidth="3" />
        <path d="M11 2 a9 9 0 0 1 9 9" fill="none" className="stroke-yellow-deep" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }
  if (status === "failed") {
    return (
      <svg viewBox="0 0 22 22" width="22" height="22" role="img" aria-label="Stopped">
        <circle cx="11" cy="11" r="10" className="fill-handoff-wash stroke-handoff-ink" strokeWidth="1.5" />
        <path d="M11 6.5 V12.5 M11 15.5 V15.6" className="stroke-handoff-ink" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 22 22" width="22" height="22" role="img" aria-label="Waiting">
      <circle cx="11" cy="11" r="9" fill="none" className="stroke-line" strokeWidth="2" strokeDasharray="3 3" />
    </svg>
  );
}
