const clockFormat = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/London" });

export function formatClockTime(isoTime: string | null): string {
  return isoTime ? clockFormat.format(new Date(isoTime)) : "—";
}
