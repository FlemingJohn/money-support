import type { IconTileProps } from "@/types/IconTileProps";

export function IconTile({ icon: Icon, className = "bg-yellow-wash text-ink" }: IconTileProps) {
  return (
    <span className={`grid size-10 shrink-0 place-items-center rounded-card ${className}`}>
      <Icon size={20} strokeWidth={1.75} aria-hidden="true" />
    </span>
  );
}
