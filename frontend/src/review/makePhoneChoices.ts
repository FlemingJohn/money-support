import type { PhoneChoice } from "@/types/PhoneChoice";
import type { PhoneSettings } from "@/types/PhoneSettings";

export function makePhoneChoices(phone: PhoneSettings): PhoneChoice[] {
  const choices: PhoneChoice[] = [];
  if (phone.deskPhone) choices.push({ value: "desk", label: `Desk · ${phone.deskPhone}` });
  if (phone.mobilePhone) choices.push({ value: "mobile", label: `Mobile · ${phone.mobilePhone}` });
  return choices;
}
