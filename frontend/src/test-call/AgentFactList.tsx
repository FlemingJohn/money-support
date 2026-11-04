import type { AgentFactListProps } from "@/types/AgentFactListProps";

export function AgentFactList({ agent }: AgentFactListProps) {
  const facts = [
    { label: "Assistant", value: agent.assistantName },
    { label: "Model", value: "gpt-4o on Vapi" },
    { label: "Voice", value: agent.voice },
    { label: "Longest call", value: `${agent.longestCallMinutes} minutes` },
  ];

  return (
    <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-2.5 px-5 py-4 text-sm">
      {facts.map((fact) => (
        <div key={fact.label} className="contents">
          <dt className="text-ink-muted">{fact.label}</dt>
          <dd className="wrap-anywhere">{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
}
