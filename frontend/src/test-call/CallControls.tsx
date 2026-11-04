import { Mic, MicOff, Phone, PhoneOff } from "lucide-react";
import { formatDuration } from "@/lib/formatDuration";
import type { CallControlsProps } from "@/types/CallControlsProps";

const statusLabels = { idle: "Ready", connecting: "Connecting…", live: "Live", ended: "Call ended", failed: "Call failed" };
const levelBars = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9];

export function CallControls({ testCall }: CallControlsProps) {
  const { status, volume, seconds, isMuted, errorMessage, start, stop, toggleMute } = testCall;
  const isActive = status === "connecting" || status === "live";

  return (
    <div className="flex flex-col items-center gap-4 p-5 text-center">
      <span role="status" className={`rounded-full px-3 py-1 text-[13px] font-semibold ${status === "live" ? "bg-success-wash text-success-ink" : status === "failed" ? "bg-handoff-wash text-handoff-ink" : "bg-sand text-ink-muted"}`}>
        {statusLabels[status]}
      </span>
      <span aria-label="Call length" className="font-mono text-4xl font-bold tabular-nums">{formatDuration(seconds)}</span>
      <span aria-hidden="true" className="flex h-8 items-end gap-1">
        {levelBars.map((level) => (
          <span key={level} className={`w-2 rounded-full ${volume >= level ? "bg-yellow-deep" : "bg-sand"}`} style={{ height: `${Math.round(level * 100)}%` }} />
        ))}
      </span>
      {errorMessage && <p role="alert" className="text-sm text-handoff-ink">{errorMessage}</p>}
      {isActive ? (
        <div className="flex gap-2">
          <button type="button" onClick={stop} className="inline-flex min-h-11 items-center gap-2 rounded-control bg-handoff-ink px-4 text-sm font-semibold text-paper">
            <PhoneOff size={16} strokeWidth={2} aria-hidden="true" />
            End call
          </button>
          <button type="button" onClick={toggleMute} aria-pressed={isMuted} disabled={status !== "live"} className="inline-flex min-h-11 items-center gap-2 rounded-control border border-line px-4 text-sm font-semibold hover:bg-surface disabled:opacity-40">
            {isMuted ? <MicOff size={16} strokeWidth={2} aria-hidden="true" /> : <Mic size={16} strokeWidth={2} aria-hidden="true" />}
            {isMuted ? "Unmute" : "Mute"}
          </button>
        </div>
      ) : (
        <button type="button" onClick={start} className="inline-flex min-h-11 items-center gap-2 rounded-control bg-yellow px-5 text-sm font-semibold text-ink hover:bg-yellow-deep">
          <Phone size={16} strokeWidth={2} aria-hidden="true" />
          {status === "idle" ? "Start test call" : "Call again"}
        </button>
      )}
    </div>
  );
}
