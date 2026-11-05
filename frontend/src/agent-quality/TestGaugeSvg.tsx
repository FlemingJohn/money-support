import type { TestGaugeSvgProps } from "@/types/TestGaugeSvgProps";

const radius = 30;
const circumference = 2 * Math.PI * radius;

export function TestGaugeSvg({ passedCount, totalCount, label }: TestGaugeSvgProps) {
  const share = totalCount === 0 ? 0 : passedCount / totalCount;
  const isAllPassed = totalCount > 0 && passedCount === totalCount;

  return (
    <svg viewBox="0 0 80 80" width="80" height="80" role="img" aria-label={`${label}: ${passedCount} of ${totalCount} passed`}>
      <circle cx="40" cy="40" r={radius} fill="none" className="stroke-line" strokeWidth="8" />
      <circle
        cx="40"
        cy="40"
        r={radius}
        fill="none"
        className={isAllPassed ? "stroke-success" : "stroke-yellow-deep"}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={`${share * circumference} ${circumference}`}
        transform="rotate(-90 40 40)"
      />
      <text x="40" y="38" textAnchor="middle" className="fill-ink text-[15px] font-bold">
        {passedCount}
      </text>
      <text x="40" y="53" textAnchor="middle" className="fill-ink-muted text-[10px]">
        of {totalCount}
      </text>
    </svg>
  );
}
