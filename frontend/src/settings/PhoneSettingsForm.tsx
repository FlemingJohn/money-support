"use client";

import { FieldRow } from "@/components/FieldRow";
import { useSettingsForm } from "@/hooks/useSettingsForm";
import { SettingsFormFooter } from "@/settings/SettingsFormFooter";
import type { PhoneSettings } from "@/types/PhoneSettings";
import type { SettingsFormProps } from "@/types/SettingsFormProps";

const controlLook = "min-h-11 w-full max-w-sm rounded-control border border-line bg-paper px-3 text-sm";

export function PhoneSettingsForm({ initialValues }: SettingsFormProps<PhoneSettings>) {
  const { values, hasChanged, savingState, errorMessage, change, reset, save } = useSettingsForm(initialValues, "phone");

  return (
    <div className="flex flex-col">
      <FieldRow label="Desk phone to ring first" detail="For call backs. With the country code, for example +442079460000.">
        <input aria-label="Desk phone" type="tel" value={values.deskPhone} onChange={(event) => change({ deskPhone: event.target.value.replaceAll(" ", "") })} placeholder="+442079460000" className={`${controlLook} font-mono`} />
      </FieldRow>
      <FieldRow label="Mobile phone to ring first">
        <input aria-label="Mobile phone" type="tel" value={values.mobilePhone} onChange={(event) => change({ mobilePhone: event.target.value.replaceAll(" ", "") })} placeholder="+447700900000" className={`${controlLook} font-mono`} />
      </FieldRow>
      <FieldRow label="Delete stored caller numbers" detail="Numbers are kept encrypted, only for call backs.">
        <select aria-label="Delete stored caller numbers" value={values.storedNumberRetention} onChange={(event) => change({ storedNumberRetention: event.target.value as PhoneSettings["storedNumberRetention"] })} className={controlLook}>
          <option value="whenResolved">When the review is resolved</option>
          <option value="afterSevenDays">After 7 days</option>
        </select>
      </FieldRow>
      <SettingsFormFooter hasChanged={hasChanged} savingState={savingState} errorMessage={errorMessage} saveLabel="Save" onReset={reset} onSave={save} />
    </div>
  );
}
