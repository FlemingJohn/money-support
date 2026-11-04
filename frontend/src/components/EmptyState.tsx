import type { EmptyStateProps } from "@/types/EmptyStateProps";

export function EmptyState({ message }: EmptyStateProps) {
  return <p className="px-5 py-8 text-center text-sm text-ink-muted">{message}</p>;
}
