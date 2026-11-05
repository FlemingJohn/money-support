import type { SuggestionStreamState } from "@/types/SuggestionStreamState";

export function makeSuggestionSteps(): SuggestionStreamState {
  return {
    steps: [
      { key: "feedback", label: "Read the failing tests from reviews", status: "active", detail: "" },
      { key: "rule", label: "Write one rule", status: "waiting", detail: "" },
      { key: "tests", label: "Test it on a copy of the agent", status: "waiting", detail: "" },
    ],
    testsDone: 0,
    testsTotal: 0,
    message: "",
  };
}
