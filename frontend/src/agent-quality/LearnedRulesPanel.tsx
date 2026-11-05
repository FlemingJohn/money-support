import { PromptRuleRow } from "@/agent-quality/PromptRuleRow";
import type { LearnedRulesPanelProps } from "@/types/LearnedRulesPanelProps";

export function LearnedRulesPanel({ rules }: LearnedRulesPanelProps) {
  return (
    <div className="flex flex-col">
      <p className="p-5 text-sm text-ink-muted">These rules are added to the end of the agent&apos;s prompt. Switching one off updates the agent straight away.</p>
      {rules.length === 0 ? (
        <p className="px-5 pb-5 text-sm text-ink-muted">No learned rules yet. Approve a suggestion to add one.</p>
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
