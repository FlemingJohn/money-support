import type { Callback } from "@/types/Callback";
import type { PhoneSettings } from "@/types/PhoneSettings";
import type { ReviewDetail } from "@/types/ReviewDetail";

export interface ReviewWorkspaceProps {
  detail: ReviewDetail;
  callbacks: Callback[];
  phone: PhoneSettings;
}
