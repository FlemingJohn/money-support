import { Suspense } from "react";
import { OverviewContent } from "@/overview/OverviewContent";
import { OverviewLoading } from "@/overview/OverviewLoading";

export default function OverviewPage({ searchParams }: PageProps<"/">) {
  return (
    <Suspense fallback={<OverviewLoading />}>
      <OverviewContent searchParams={searchParams} />
    </Suspense>
  );
}
