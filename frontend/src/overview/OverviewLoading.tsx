export function OverviewLoading() {
  return (
    <div role="status" className="flex flex-1 flex-col gap-4">
      <span className="sr-only">Loading the overview</span>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-4">
        {placeholderStats.map((placeholder) => (
          <div key={placeholder} className="h-44 animate-pulse rounded-card border border-line bg-surface" />
        ))}
      </div>
      <div className="h-80 animate-pulse rounded-card border border-line bg-surface" />
      <div className="h-72 animate-pulse rounded-card border border-line bg-surface" />
    </div>
  );
}

const placeholderStats = ["calls", "resolved", "handedOff", "length"];
