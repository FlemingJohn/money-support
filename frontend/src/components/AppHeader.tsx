"use client";

import { usePathname } from "next/navigation";
import { AccountButton } from "@/components/AccountButton";
import { AgentStatusBadge } from "@/components/AgentStatusBadge";
import { PrivacyModeButton } from "@/components/PrivacyModeButton";
import { SearchField } from "@/components/SearchField";
import { getPageTitle } from "@/lib/getPageTitle";

export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="flex min-h-16 flex-wrap items-center gap-x-5 gap-y-3 border-b border-line bg-paper px-6 py-2.5">
      <h1 className="min-w-0 flex-1 truncate text-xl font-bold">{getPageTitle(pathname)}</h1>
      <SearchField />
      <div className="flex shrink-0 items-center gap-2.5">
        <AgentStatusBadge />
        <PrivacyModeButton />
        <AccountButton />
      </div>
    </header>
  );
}
