import { ChartLegendItem } from "@/components/ChartLegendItem";
import type { OutcomeLegendProps } from "@/types/OutcomeLegendProps";

export function OutcomeLegend({ shares }: OutcomeLegendProps) {
  return (
    <dl className="flex min-w-0 flex-[1_1_120px] flex-col gap-2.5">
      {shares.map((share) => (
        <div key={share.label} className="flex items-center gap-2 text-sm">
          <dt className="text-ink">
            <ChartLegendItem label={share.label} color={share.color} />
          </dt>
          <dd className="ml-auto font-bold tabular-nums">{share.count}</dd>
        </div>
      ))}
    </dl>
  );
}
