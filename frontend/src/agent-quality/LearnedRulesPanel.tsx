import { PromptRuleRow } from "@/agent-quality/PromptRuleRow";
import type { LearnedRulesPanelProps } from "@/types/LearnedRulesPanelProps";

export function LearnedRulesPanel({ rules }: LearnedRulesPanelProps) {
  return (
    <div className="flex flex-col">
      {rules.length === 0 ? (
        <p className="p-5 text-sm text-ink-muted">No learned rules yet.</p>
      ) : (
        <ul aria-label="Learned rules" className="border-t border-line-soft">
          {rules.map((rule) => (
            <PromptRuleRow key={rule.id} rule={rule} />
          ))}
        </ul>
      )}
    </div>
  );
}
