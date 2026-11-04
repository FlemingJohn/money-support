import type { PageLoadingProps } from "@/types/PageLoadingProps";

export function PageLoading({ label }: PageLoadingProps) {
  return (
    <div role="status" className="flex flex-1 flex-col gap-4">
      <span className="sr-only">{label}</span>
      <div className="h-12 w-full max-w-md animate-pulse rounded-card border border-line bg-surface" />
      <div className="min-h-96 flex-1 animate-pulse rounded-card border border-line bg-surface" />
    </div>
  );
}
