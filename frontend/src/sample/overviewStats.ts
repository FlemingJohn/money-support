import { ArrowLeftRight, CircleCheck, Clock, Phone } from "lucide-react";
import type { Stat } from "@/types/Stat";

export const overviewStats: Stat[] = [
  { label: "Calls today", value: "128", icon: Phone, detail: "12% vs yesterday", tone: "good", trend: "up" },
  { label: "Resolved by agent", value: "74%", icon: CircleCheck, detail: "95 of 128 calls", tone: "neutral", progress: 74 },
  { label: "Handed to a person", value: "33", icon: ArrowLeftRight, detail: "4% vs yesterday", tone: "good", trend: "down" },
  { label: "Average call length", value: "01:47", icon: Clock, detail: "8 s shorter than yesterday", tone: "neutral", trend: "down", isMonospace: true },
];
