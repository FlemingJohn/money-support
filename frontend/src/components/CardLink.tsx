import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { CardLinkProps } from "@/types/CardLinkProps";

export function CardLink({ href, label }: CardLinkProps) {
  return (
    <Link href={href} className="inline-flex min-h-11 items-center gap-1 whitespace-nowrap text-sm font-semibold text-ink hover:underline">
      {label}
      <ChevronRight size={16} strokeWidth={2} aria-hidden="true" />
    </Link>
  );
}
