import { FieldRow } from "@/components/FieldRow";
import type { ConnectionsPanelProps } from "@/types/ConnectionsPanelProps";

const serviceNames: Record<string, string> = { database: "Database", ai: "Agent builder and redaction (ai/)", callbacks: "Call backs (Twilio)" };
const stateLooks = {
  up: { label: "Up", colors: "bg-success-wash text-success-ink" },
  down: { label: "Down", colors: "bg-handoff-wash text-handoff-ink" },
  notConfigured: { label: "Not set up", colors: "bg-sand text-ink-muted" },
};

export function ConnectionsPanel({ health, webhookUrl }: ConnectionsPanelProps) {
  return (
    <div className="flex flex-col">
      {health.services.map((service) => {
        const look = stateLooks[service.state];
        return (
          <FieldRow key={service.name} label={serviceNames[service.name] ?? service.name} detail={service.latencyMilliseconds === null ? undefined : `Answered in ${service.latencyMilliseconds} ms`}>
            <span className={`rounded-full px-3 py-1 text-[13px] font-semibold ${look.colors}`}>{look.label}</span>
          </FieldRow>
        );
      })}
      <FieldRow label="Vapi webhook" detail="Vapi sends call events here. The secret and API keys stay on the server.">
        <code className="max-w-full truncate rounded-control bg-surface px-3 py-2 font-mono text-[13px]">{webhookUrl}</code>
      </FieldRow>
    </div>
  );
}
