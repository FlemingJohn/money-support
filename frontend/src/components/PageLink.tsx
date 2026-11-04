import Link from "next/link";
import type { PageLinkProps } from "@/types/PageLinkProps";

export function PageLink({ href, label, isEnabled, children }: PageLinkProps) {
  const look = "grid size-11 place-items-center rounded-control border border-line bg-paper text-ink";

  if (!isEnabled) {
    return (
      <span aria-disabled="true" aria-label={label} className={`${look} opacity-40`}>
        {children}
      </span>
    );
  }

  return (
    <Link href={href} aria-label={label} className={`${look} hover:bg-surface`}>
      {children}
    </Link>
  );
}
