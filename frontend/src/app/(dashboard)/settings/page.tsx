import { Suspense } from "react";
import { PageLoading } from "@/components/PageLoading";
import { SettingsContent } from "@/settings/SettingsContent";

export default function SettingsPage({ searchParams }: PageProps<"/settings">) {
  return (
    <Suspense fallback={<PageLoading label="Loading settings" />}>
      <SettingsContent searchParams={searchParams} />
    </Suspense>
  );
}
