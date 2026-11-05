import { EmptyTestsSvg } from "@/agent-quality/EmptyTestsSvg";
import { SuggestButton } from "@/agent-quality/SuggestButton";
import { SuggestionCard } from "@/agent-quality/SuggestionCard";
import { SuggestionHistoryRow } from "@/agent-quality/SuggestionHistoryRow";
import type { SuggestionsPanelProps } from "@/types/SuggestionsPanelProps";

export function SuggestionsPanel({ suggestions }: SuggestionsPanelProps) {
  const pending = suggestions.filter((suggestion) => suggestion.status === "pending");
  const history = suggestions.filter((suggestion) => suggestion.status !== "pending" && suggestion.status !== "testing");

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-3 p-5">
        <SuggestButton />
        {pending.map((suggestion) => (
          <SuggestionCard key={suggestion.id} suggestion={suggestion} />
        ))}
      </div>
      {history.length > 0 ? (
        <section aria-label="Earlier suggestions" className="border-t border-line-soft">
          <h3 className="px-5 pt-4 text-sm font-semibold">History</h3>
          <ul className="max-h-[50vh] overflow-y-auto">
            {history.map((suggestion) => (
              <SuggestionHistoryRow key={suggestion.id} suggestion={suggestion} />
            ))}
          </ul>
        </section>
      ) : (
        pending.length === 0 && (
          <div className="flex flex-col items-center gap-3 border-t border-line-soft px-5 py-8 text-center text-sm text-ink-muted">
            <EmptyTestsSvg />
            <p>No suggestions yet.</p>
          </div>
        )
      )}
    </div>
  );
}
