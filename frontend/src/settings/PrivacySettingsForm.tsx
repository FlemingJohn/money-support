"use client";

import { FieldRow } from "@/components/FieldRow";
import { Switch } from "@/components/Switch";
import { useSettingsForm } from "@/hooks/useSettingsForm";
import { privacyToggles } from "@/settings/privacyToggles";
import { SettingsFormFooter } from "@/settings/SettingsFormFooter";
import type { PrivacySettings } from "@/types/PrivacySettings";
import type { SettingsFormProps } from "@/types/SettingsFormProps";

export function PrivacySettingsForm({ initialValues }: SettingsFormProps<PrivacySettings>) {
  const { values, hasChanged, savingState, errorMessage, change, reset, save } = useSettingsForm(initialValues, "privacy");

  return (
    <div className="flex flex-col">
      {privacyToggles.map((toggle) => (
        <FieldRow key={toggle.key} label={toggle.label} detail={toggle.detail}>
          <Switch isOn={values[toggle.key]} label={toggle.label} onToggle={() => change({ [toggle.key]: !values[toggle.key] })} />
        </FieldRow>
      ))}
      <FieldRow label="Call recording" detail="Audio can't be redacted, so recording stays off.">
        <span className="rounded-full bg-sand px-3 py-1 text-[13px] font-semibold text-ink-muted">Off</span>
      </FieldRow>
      <FieldRow label="Keep transcripts for" detail="Older transcripts and fields are deleted every hour.">
        <select
          aria-label="Keep transcripts for"
          value={values.transcriptRetentionDays}
          onChange={(event) => change({ transcriptRetentionDays: Number(event.target.value) as PrivacySettings["transcriptRetentionDays"] })}
          className="min-h-11 w-full max-w-sm rounded-control border border-line bg-paper px-3 text-sm"
        >
          <option value={7}>7 days</option>
          <option value={30}>30 days</option>
          <option value={90}>90 days</option>
        </select>
      </FieldRow>
      <SettingsFormFooter hasChanged={hasChanged} savingState={savingState} errorMessage={errorMessage} saveLabel="Save and update agent" onReset={reset} onSave={save} />
    </div>
  );
}
