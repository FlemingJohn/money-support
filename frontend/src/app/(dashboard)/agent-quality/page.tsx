import { Suspense } from "react";
import { AgentQualityContent } from "@/agent-quality/AgentQualityContent";
import { PageLoading } from "@/components/PageLoading";

export default function AgentQualityPage({ searchParams }: PageProps<"/agent-quality">) {
  return (
    <Suspense fallback={<PageLoading label="Loading agent quality" />}>
      <AgentQualityContent searchParams={searchParams} />
    </Suspense>
  );
}
