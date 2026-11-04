"use client";

import { FieldRow } from "@/components/FieldRow";
import { useSettingsForm } from "@/hooks/useSettingsForm";
import { SettingsFormFooter } from "@/settings/SettingsFormFooter";
import type { AgentSettings } from "@/types/AgentSettings";
import type { SettingsFormProps } from "@/types/SettingsFormProps";
import type { VoiceName } from "@/types/VoiceName";

const voices: VoiceName[] = ["Elliot", "Kylie", "Rohan"];
const callLengths = [5, 10, 15, 20, 30];
const silenceLengths = [7, 10, 15, 20, 30];
const controlLook = "min-h-11 w-full max-w-sm rounded-control border border-line bg-paper px-3 text-sm";

export function AgentSettingsForm({ initialValues }: SettingsFormProps<AgentSettings>) {
  const { values, hasChanged, savingState, errorMessage, change, reset, save } = useSettingsForm(initialValues, "agent");

  return (
    <div className="flex flex-col">
      <FieldRow label="Assistant name" detail="How the agent introduces itself.">
        <input aria-label="Assistant name" value={values.assistantName} onChange={(event) => change({ assistantName: event.target.value })} maxLength={80} className={controlLook} />
      </FieldRow>
      <FieldRow label="Greeting" detail="The first thing callers hear.">
        <textarea aria-label="Greeting" value={values.greeting} onChange={(event) => change({ greeting: event.target.value })} rows={3} maxLength={400} className={`${controlLook} py-2 leading-relaxed`} />
      </FieldRow>
      <FieldRow label="Language">
        <select aria-label="Language" value={values.language} disabled className={controlLook}>
          <option value="en">English</option>
        </select>
      </FieldRow>
      <FieldRow label="Voice">
        <select aria-label="Voice" value={values.voice} onChange={(event) => change({ voice: event.target.value as VoiceName })} className={controlLook}>
          {voices.map((voice) => (
            <option key={voice} value={voice}>{voice}</option>
          ))}
        </select>
      </FieldRow>
      <FieldRow label="Longest call" detail="The agent ends the call after this.">
        <select aria-label="Longest call" value={values.longestCallMinutes} onChange={(event) => change({ longestCallMinutes: Number(event.target.value) })} className={controlLook}>
          {callLengths.map((minutes) => (
            <option key={minutes} value={minutes}>{minutes} minutes</option>
          ))}
        </select>
      </FieldRow>
      <FieldRow label="Silence before “Are you still there?”" detail="After two reminders the agent says goodbye.">
        <select aria-label="Silence before asking" value={values.silenceSeconds} onChange={(event) => change({ silenceSeconds: Number(event.target.value) })} className={controlLook}>
          {silenceLengths.map((seconds) => (
            <option key={seconds} value={seconds}>{seconds} seconds</option>
          ))}
        </select>
      </FieldRow>
      <SettingsFormFooter hasChanged={hasChanged} savingState={savingState} errorMessage={errorMessage} saveLabel="Save and update agent" onReset={reset} onSave={save} />
    </div>
  );
}
