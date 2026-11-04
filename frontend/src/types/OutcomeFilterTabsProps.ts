import type { CallFilter } from "@/types/CallFilter";
import type { OutcomeFilterOption } from "@/types/OutcomeFilterOption";

export interface OutcomeFilterTabsProps {
  options: OutcomeFilterOption[];
  filter: CallFilter;
}
