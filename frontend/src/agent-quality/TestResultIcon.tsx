import type { TestResultIconProps } from "@/types/TestResultIconProps";

export function TestResultIcon({ result }: TestResultIconProps) {
  if (result === "passed") {
    return (
      <svg viewBox="0 0 20 20" width="20" height="20" role="img" aria-label="Passed">
        <circle cx="10" cy="10" r="9" className="fill-success-wash stroke-success" strokeWidth="1.5" />
        <path d="M6 10.5 L8.8 13 L14 7.5" fill="none" className="stroke-success" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (result === "failed") {
    return (
      <svg viewBox="0 0 20 20" width="20" height="20" role="img" aria-label="Failed">
        <circle cx="10" cy="10" r="9" className="fill-handoff-wash stroke-handoff-ink" strokeWidth="1.5" />
        <path d="M7 7 L13 13 M13 7 L7 13" className="stroke-handoff-ink" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 20 20" width="20" height="20" role="img" aria-label="Not run yet">
      <circle cx="10" cy="10" r="9" className="fill-sand stroke-line" strokeWidth="1.5" strokeDasharray="3 3" />
    </svg>
  );
}
