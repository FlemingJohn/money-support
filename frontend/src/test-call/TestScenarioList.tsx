import { makeTestScenarioGroups } from "@/test-call/makeTestScenarioGroups";
import type { TestScenarioListProps } from "@/types/TestScenarioListProps";

export function TestScenarioList({ faqQuestions }: TestScenarioListProps) {
  return (
    <div className="flex flex-col">
      {makeTestScenarioGroups(faqQuestions).map((group) => (
        <section key={group.title} aria-label={group.title} className="border-b border-line-soft last:border-b-0">
          <h3 className="px-5 pt-3 text-xs font-semibold uppercase tracking-wide text-ink-muted">{group.title}</h3>
          <ul className="flex flex-col">
            {group.scenarios.map((scenario) => (
              <li key={scenario.line} className="flex items-center justify-between gap-3 px-5 py-2.5 text-sm">
                <span className="min-w-0">“{scenario.line}”</span>
                <span className="shrink-0 rounded-full bg-sand px-2.5 py-0.5 text-xs font-semibold text-ink-muted">{scenario.expectation}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
