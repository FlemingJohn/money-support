import { Suspense } from "react";
import { AccountButton } from "@/components/AccountButton";
import { AgentStatusBadge } from "@/components/AgentStatusBadge";
import { PageTitle } from "@/components/PageTitle";
import { PrivacyModeButton } from "@/components/PrivacyModeButton";
import { SearchField } from "@/components/SearchField";

export function AppHeader() {
  return (
    <header className="flex min-h-16 flex-wrap items-center gap-x-5 gap-y-3 border-b border-line bg-paper px-6 py-2.5">
      <Suspense fallback={<h1 className="min-w-0 flex-1 truncate text-xl font-bold">Money Support</h1>}>
        <PageTitle />
      </Suspense>
      <SearchField />
      <div className="flex shrink-0 items-center gap-2.5">
        <AgentStatusBadge />
        <PrivacyModeButton />
        <AccountButton />
      </div>
    </header>
  );
}
