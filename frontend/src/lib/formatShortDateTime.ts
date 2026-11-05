const shortDateTimeFormat = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Europe/London" });

export function formatShortDateTime(isoTime: string): string {
  return shortDateTimeFormat.format(new Date(isoTime));
}
