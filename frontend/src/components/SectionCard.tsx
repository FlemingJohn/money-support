import type { SectionCardProps } from "@/types/SectionCardProps";

export function SectionCard({ title, icon: Icon, action, children, className = "" }: SectionCardProps) {
  return (
    <section className={`flex min-w-0 flex-col rounded-card border border-line bg-paper ${className}`}>
      <header className="flex min-h-14 flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-line-soft px-5 py-2">
        <h2 className="flex items-center gap-2 whitespace-nowrap text-[15px] font-semibold">
          <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
          {title}
        </h2>
        {action}
      </header>
      {children}
    </section>
  );
}
