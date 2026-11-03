export function AgentStatusBadge() {
  return (
    <span className="inline-flex min-h-8 items-center gap-2 whitespace-nowrap rounded-full bg-success-wash px-3 text-[13px] font-semibold text-success-ink">
      <span aria-hidden="true" className="size-2 rounded-full bg-success" />
      Agent live · v7
    </span>
  );
}
