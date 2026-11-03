import type { ChartLegendItemProps } from "@/types/ChartLegendItemProps";

export function ChartLegendItem({ label, color }: ChartLegendItemProps) {
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-[13px] text-ink-muted">
      <span aria-hidden="true" className={`size-2.5 rounded-[3px] ${swatchColors[color]}`} />
      {label}
    </span>
  );
}

const swatchColors = {
  yellow: "bg-yellow",
  ink: "bg-ink",
};
