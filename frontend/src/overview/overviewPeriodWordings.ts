import type { OverviewPeriod } from "@/types/OverviewPeriod";
import type { OverviewPeriodWording } from "@/types/OverviewPeriodWording";

export const overviewPeriodWordings: Record<OverviewPeriod, OverviewPeriodWording> = {
  today: {
    tabLabel: "Today",
    callCountLabel: "Calls today",
    chartTitle: "Calls per hour",
    comparison: "yesterday",
    noHandOffs: "No hand-offs today.",
    noCalls: "No calls yet today.",
  },
  "7d": {
    tabLabel: "7 days",
    callCountLabel: "Calls in 7 days",
    chartTitle: "Calls per day",
    comparison: "the 7 days before",
    noHandOffs: "No hand-offs in the last 7 days.",
    noCalls: "No calls in the last 7 days.",
  },
  "30d": {
    tabLabel: "30 days",
    callCountLabel: "Calls in 30 days",
    chartTitle: "Calls per day",
    comparison: "the 30 days before",
    noHandOffs: "No hand-offs in the last 30 days.",
    noCalls: "No calls in the last 30 days.",
  },
};
