import { personalDataPatterns } from "@/lib/personalDataPatterns";

export function maskPersonalData(text: string, entityTypes: string[]): string {
  return personalDataPatterns
    .filter((pattern) => entityTypes.includes(pattern.entityType))
    .reduce((maskedText, pattern) => maskedText.replace(pattern.expression, `[${pattern.entityType} removed]`), text);
}
