import type { ColumnHeadingProps } from "@/types/ColumnHeadingProps";

export function ColumnHeading({ icon: Icon, label }: ColumnHeadingProps) {
  return (
    <span className="flex items-center gap-1.5 whitespace-nowrap">
      <Icon size={14} strokeWidth={2} aria-hidden="true" />
      {label}
    </span>
  );
}
