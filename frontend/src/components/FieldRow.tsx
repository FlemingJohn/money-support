import type { FieldRowProps } from "@/types/FieldRowProps";

export function FieldRow({ label, detail, children }: FieldRowProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-line-soft py-4 last:border-b-0">
      <span className="flex min-w-0 flex-[1_1_240px] flex-col">
        <span className="text-sm font-semibold">{label}</span>
        {detail && <span className="text-[13px] text-ink-muted">{detail}</span>}
      </span>
      <span className="flex min-w-0 flex-[1_1_280px] justify-end">{children}</span>
    </div>
  );
}
