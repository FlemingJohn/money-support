import type { FactTileProps } from "@/types/FactTileProps";

export function FactTile({ icon: Icon, label, value, isMonospace = false }: FactTileProps) {
  return (
    <div className="flex min-h-13 items-center gap-2.5 rounded-card border border-line-soft bg-surface py-1.5 pr-3.5 pl-2">
      <span className="grid size-9 shrink-0 place-items-center rounded-control bg-yellow-wash">
        <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
      </span>
      <span className="flex flex-col">
        <dt className="text-xs font-semibold text-ink-muted">{label}</dt>
        <dd className={`text-[15px] font-bold ${isMonospace ? "font-mono" : ""}`}>{value}</dd>
      </span>
    </div>
  );
}
