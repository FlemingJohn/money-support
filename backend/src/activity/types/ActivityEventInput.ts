import type { ActivityAction, ActivityItemType } from "../../generated/prisma/client";

export interface ActivityEventInput {
  action: ActivityAction;
  itemType: ActivityItemType;
  itemId: string;
}
