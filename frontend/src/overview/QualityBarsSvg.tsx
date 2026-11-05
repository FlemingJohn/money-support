import { verdictReasonLabels } from "@/lib/verdictReasonLabels";
import type { QualityBarsSvgProps } from "@/types/QualityBarsSvgProps";

const rowHeight = 30;
const labelWidth = 170;
const barWidth = 160;

export function QualityBarsSvg({ reasons }: QualityBarsSvgProps) {
  const highest = Math.max(1, ...reasons.map((reason) => reason.count));

  return (
    <svg viewBox={`0 0 ${labelWidth + barWidth + 30} ${reasons.length * rowHeight}`} className="w-full max-w-md" role="img" aria-label="Mistakes by reason">
      {reasons.map((reason, index) => {
        const y = index * rowHeight;
        const width = Math.max(6, (reason.count / highest) * barWidth);
        return (
          <g key={reason.reason}>
            <text x="0" y={y + 19} className="fill-ink text-[12px]">
              {verdictReasonLabels[reason.reason]}
            </text>
            <rect x={labelWidth} y={y + 7} width={barWidth} height="16" rx="8" className="fill-sand" />
            <rect x={labelWidth} y={y + 7} width={width} height="16" rx="8" className="fill-handoff-ink" />
            <text x={labelWidth + barWidth + 8} y={y + 19} className="fill-ink text-[12px] font-bold">
              {reason.count}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
