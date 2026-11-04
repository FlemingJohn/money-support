import type { PhoneSettings } from "@/types/PhoneSettings";
import type { ReviewDetail } from "@/types/ReviewDetail";

export interface ReviewHeaderProps {
  detail: ReviewDetail;
  phone: PhoneSettings;
}
