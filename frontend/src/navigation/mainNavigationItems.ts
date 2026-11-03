import { BookOpen, Flag, LayoutGrid, Mic, Phone } from "lucide-react";
import { reviewPreviews } from "@/sample/reviewPreviews";
import type { NavigationItem } from "@/types/NavigationItem";

export const mainNavigationItems: NavigationItem[] = [
  { label: "Overview", href: "/", icon: LayoutGrid },
  { label: "Calls", href: "/calls", icon: Phone },
  { label: "Review queue", href: "/review", icon: Flag, badgeCount: reviewPreviews.length },
  { label: "FAQs", href: "/faqs", icon: BookOpen },
  { label: "Test call", href: "/test-call", icon: Mic },
];
