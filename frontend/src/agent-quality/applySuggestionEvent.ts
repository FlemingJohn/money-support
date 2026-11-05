import type { StreamEvent } from "@/types/StreamEvent";
import type { SuggestionStepStatus } from "@/types/SuggestionStepStatus";
import type { SuggestionStreamState } from "@/types/SuggestionStreamState";

const order = ["feedback", "rule", "tests"];

export function applySuggestionEvent(state: SuggestionStreamState, event: StreamEvent): SuggestionStreamState {
  if (event.type === "progress") return { ...state, testsDone: Number(event.done), testsTotal: Number(event.total) };
  if (event.type === "nothing" || event.type === "error") return { ...markActive(state, "failed"), message: String(event.message ?? "") };
  if (event.type !== "step") return state;
  const isDone = event.status === "done";
  const nextKey = order[order.indexOf(String(event.step)) + 1];
  const steps = state.steps.map((step) => {
    if (step.key === event.step) return { ...step, status: (isDone ? "done" : "active") as SuggestionStepStatus, detail: String(event.detail ?? step.detail) };
    if (isDone && step.key === nextKey) return { ...step, status: "active" as SuggestionStepStatus };
    return step;
  });
  return { ...state, steps };
}

function markActive(state: SuggestionStreamState, status: SuggestionStepStatus): SuggestionStreamState {
  return { ...state, steps: state.steps.map((step) => (step.status === "active" ? { ...step, status } : step)) };
}
