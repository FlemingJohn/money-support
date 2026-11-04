"use client";

import { FieldRow } from "@/components/FieldRow";
import { Switch } from "@/components/Switch";
import { useSettingsForm } from "@/hooks/useSettingsForm";
import { HandOffModePicker } from "@/settings/HandOffModePicker";
import { SettingsFormFooter } from "@/settings/SettingsFormFooter";
import type { HandOffSettings } from "@/types/HandOffSettings";
import type { SettingsFormProps } from "@/types/SettingsFormProps";

const controlLook = "min-h-11 w-full max-w-sm rounded-control border border-line bg-paper px-3 text-sm disabled:bg-surface disabled:text-ink-muted";

export function HandOffSettingsForm({ initialValues }: SettingsFormProps<HandOffSettings>) {
  const { values, hasChanged, savingState, errorMessage, change, reset, save } = useSettingsForm(initialValues, "hand-off");
  const isTransfer = values.mode === "transfer";

  return (
    <div className="flex flex-col">
      <HandOffModePicker mode={values.mode} onChange={(mode) => change({ mode })} />
      <FieldRow label="Hand-off sentence" detail="The agent says exactly this before it hands off.">
        <textarea aria-label="Hand-off sentence" value={values.handOffSentence} onChange={(event) => change({ handOffSentence: event.target.value })} rows={2} maxLength={300} className={`${controlLook} py-2`} />
      </FieldRow>
      <FieldRow label="Transfer number" detail="With the country code, for example +442079460000.">
        <input aria-label="Transfer number" type="tel" value={values.transferNumber} onChange={(event) => change({ transferNumber: event.target.value.replaceAll(" ", "") })} disabled={!isTransfer} placeholder="+442079460000" className={`${controlLook} font-mono`} />
      </FieldRow>
      <FieldRow label="Team hours" detail="Outside these hours the agent says the team is closed instead of transferring.">
        <select aria-label="Team hours" value={values.teamHours} onChange={(event) => change({ teamHours: event.target.value as HandOffSettings["teamHours"] })} disabled={!isTransfer} className={controlLook}>
          <option value="weekdays">Mon–Fri, 9am–5pm UK time</option>
          <option value="always">Every day, all hours</option>
        </select>
      </FieldRow>
      <FieldRow label="Email the team" detail="Send an email after every hand-off, missed transfer or out-of-hours call.">
        <Switch isOn={values.emailTeam} label="Email the team" onToggle={() => change({ emailTeam: !values.emailTeam })} />
      </FieldRow>
      <FieldRow label="Team email" detail="Where hand-off emails go. Only masked details are sent.">
        <input aria-label="Team email" type="email" value={values.teamEmail} onChange={(event) => change({ teamEmail: event.target.value.trim() })} disabled={!values.emailTeam} placeholder="support@example.com" className={controlLook} />
      </FieldRow>
      <SettingsFormFooter hasChanged={hasChanged} savingState={savingState} errorMessage={errorMessage} saveLabel="Save and update agent" onReset={reset} onSave={save} />
    </div>
  );
}
