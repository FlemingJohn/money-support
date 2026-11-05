import { FlaskConical, Lightbulb, ScrollText } from "lucide-react";
import type { AgentQualityTabLink } from "@/types/AgentQualityTabLink";

export const agentQualityTabLinks: AgentQualityTabLink[] = [
  { tab: "tests", label: "Tests", icon: FlaskConical },
  { tab: "suggestions", label: "Suggestions", icon: Lightbulb },
  { tab: "rules", label: "Learned rules", icon: ScrollText },
];
