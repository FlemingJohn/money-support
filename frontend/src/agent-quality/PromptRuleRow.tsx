"use client";

import { Switch } from "@/components/Switch";
import { useBackendChange } from "@/hooks/useBackendChange";
import { formatShortDateTime } from "@/lib/formatShortDateTime";
import type { PromptRuleRowProps } from "@/types/PromptRuleRowProps";

export function PromptRuleRow({ rule }: PromptRuleRowProps) {
  const { savingState, send } = useBackendChange();

  return (
    <li className="flex items-center gap-3 border-b border-line-soft px-5 py-3 last:border-b-0">
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-sm wrap-anywhere">{rule.ruleText}</span>
        <span className="text-[13px] text-ink-muted">Approved {formatShortDateTime(rule.createdAt)}</span>
      </div>
      <Switch isOn={rule.isEnabled} label="Use this rule" isDisabled={savingState === "saving"} onToggle={() => send("PATCH", `/agent-quality/rules/${rule.id}`, { isEnabled: !rule.isEnabled })} />
    </li>
  );
}
