import { isActivePath } from "@/lib/isActivePath";
import { mainNavigationItems } from "@/navigation/mainNavigationItems";
import { settingsNavigationItem } from "@/navigation/settingsNavigationItem";

export function getPageTitle(pathname: string) {
  const items = [...mainNavigationItems, settingsNavigationItem];
  const match = items.find((item) => isActivePath(pathname, item.href));
  return match ? match.label : "Money Support";
}
