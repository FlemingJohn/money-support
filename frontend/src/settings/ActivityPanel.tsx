import { EmptyState } from "@/components/EmptyState";
import { describeActivity } from "@/settings/describeActivity";
import type { ActivityPanelProps } from "@/types/ActivityPanelProps";

const timeFormat = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Europe/London" });

export function ActivityPanel({ events }: ActivityPanelProps) {
  if (events.length === 0) return <EmptyState message="Nothing has happened yet." />;

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-120 border-collapse text-sm">
        <thead>
          <tr className="border-b border-line-soft text-left text-xs font-semibold tracking-wide text-ink-muted uppercase">
            <th scope="col" className="h-11 pr-3">Time</th>
            <th scope="col" className="h-11 pr-3">What happened</th>
            <th scope="col" className="h-11">Item</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id} className="border-b border-line-soft last:border-b-0">
              <td className="h-12 pr-3 font-mono text-[13px] whitespace-nowrap">{timeFormat.format(new Date(event.createdAt))}</td>
              <td className="h-12 pr-3">{describeActivity(event.action)}</td>
              <td className="h-12 max-w-60 truncate font-mono text-[13px] text-ink-muted">{event.itemId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
