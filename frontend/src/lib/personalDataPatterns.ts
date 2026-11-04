import type { PersonalDataPattern } from "@/types/PersonalDataPattern";

const nearbyWords = "[^0-9\\n]{0,25}";
const spokenDigits = "\\d(?:[\\s-]?\\d)*";
const notMoney = "(?![\\s-]?\\d)(?!\\s*(?:pounds?|euros?|dollars?|rupees?|gbp|eur|usd|inr|%))";

export const personalDataPatterns: PersonalDataPattern[] = [
  { entityType: "bank account number", expression: /\b[A-Z]{2}\d{2}(?: ?[A-Z0-9]{4}){3,7}(?: ?[A-Z0-9]{1,3})?\b/g },
  { entityType: "card number", expression: /\b(?:\d[ -]?){12,18}\d\b/g },
  { entityType: "card number", expression: new RegExp(`(?<=\\bcard\\b${nearbyWords})${spokenDigits}${notMoney}`, "gi") },
  { entityType: "bank account number", expression: new RegExp(`(?<=\\b(?:account|iban)\\b${nearbyWords})${spokenDigits}${notMoney}`, "gi") },
  { entityType: "sort code", expression: /\b\d{2}[- ]\d{2}[- ]\d{2}\b/g },
  { entityType: "email address", expression: /[\w.+-]+@[\w-]+\.[\w.-]+/g },
  { entityType: "phone number", expression: /\+\d[\d ()-]{7,}\d/g },
];
