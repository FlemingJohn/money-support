const scenarios = [
  { line: "When will my money arrive?", expectation: "Answers" },
  { line: "My transfer says complete but it has not arrived.", expectation: "Answers" },
  { line: "What are your fees to send money to India?", expectation: "Hands off" },
  { line: "That is all, thanks. Bye!", expectation: "Ends the call" },
];

export function TestScenarioList() {
  return (
    <ul className="flex flex-col">
      {scenarios.map((scenario) => (
        <li key={scenario.line} className="flex items-center justify-between gap-3 border-b border-line-soft px-5 py-3 text-sm last:border-b-0">
          <span className="min-w-0">“{scenario.line}”</span>
          <span className="shrink-0 rounded-full bg-sand px-2.5 py-0.5 text-xs font-semibold text-ink-muted">{scenario.expectation}</span>
        </li>
      ))}
    </ul>
  );
}
