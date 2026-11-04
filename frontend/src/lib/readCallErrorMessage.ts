type ErrorDetail = { message?: unknown; errorMsg?: unknown; error?: ErrorDetail | string } | string | null | undefined;

export function readCallErrorMessage(error: unknown): string {
  const message = findMessage(error as ErrorDetail, 0);
  return message ? `The call could not start: ${message}` : "The call could not start. Reload the page and try again.";
}

function findMessage(detail: ErrorDetail, depth: number): string {
  if (!detail || depth > 3) return "";
  if (typeof detail === "string") return detail;
  const ownMessage = toText(detail.message) || toText(detail.errorMsg);
  return ownMessage || findMessage(detail.error, depth + 1);
}

function toText(value: unknown): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.filter((item) => typeof item === "string").join(" ");
  return "";
}
