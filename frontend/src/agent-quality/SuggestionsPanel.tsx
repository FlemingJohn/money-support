import { EmptyTestsSvg } from "@/agent-quality/EmptyTestsSvg";
import { SuggestButton } from "@/agent-quality/SuggestButton";
import { SuggestionCard } from "@/agent-quality/SuggestionCard";
import type { SuggestionsPanelProps } from "@/types/SuggestionsPanelProps";

export function SuggestionsPanel({ suggestions }: SuggestionsPanelProps) {
  return (
    <div className="flex flex-col gap-4 p-5">
      <p className="text-sm text-ink-muted">
        The AI reads the tests from reviews that still fail, writes one new rule for the agent, and tests it on a copy of the agent. You decide whether it goes live.
      </p>
      <SuggestButton />
      {suggestions.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-6 text-center text-sm text-ink-muted">
          <EmptyTestsSvg />
          <p>No suggestions yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {suggestions.map((suggestion) => (
            <SuggestionCard key={suggestion.id} suggestion={suggestion} />
          ))}
        </div>
      )}
    </div>
  );
}
