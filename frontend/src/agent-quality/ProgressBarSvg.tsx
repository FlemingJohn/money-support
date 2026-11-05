import type { ProgressBarSvgProps } from "@/types/ProgressBarSvgProps";

export function ProgressBarSvg({ done, total, label }: ProgressBarSvgProps) {
  const share = total === 0 ? 0 : Math.min(1, done / total);

  return (
    <svg viewBox="0 0 300 12" className="h-3 w-full" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={total} aria-valuenow={done} preserveAspectRatio="none">
      <rect x="0" y="0" width="300" height="12" rx="6" className="fill-sand" />
      <rect x="0" y="0" width={Math.max(6, share * 300)} height="12" rx="6" className="fill-yellow-deep transition-[width] duration-500" />
    </svg>
  );
}
