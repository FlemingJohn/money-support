"use client";

import { usePathname } from "next/navigation";
import { getPageTitle } from "@/lib/getPageTitle";

export function PageTitle() {
  const pathname = usePathname();
  return <h1 className="min-w-0 flex-1 truncate text-xl font-bold">{getPageTitle(pathname)}</h1>;
}
