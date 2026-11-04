"use client";

import { useState } from "react";
import { useBackendChange } from "@/hooks/useBackendChange";
import type { SettingsForm } from "@/types/SettingsForm";

export function useSettingsForm<Values extends object>(initialValues: Values, sectionPath: string): SettingsForm<Values> {
  const { savingState, errorMessage, send } = useBackendChange();
  const [savedValues, setSavedValues] = useState(initialValues);
  const [values, setValues] = useState(initialValues);
  const hasChanged = JSON.stringify(values) !== JSON.stringify(savedValues);

  function change(changes: Partial<Values>) {
    setValues((current) => ({ ...current, ...changes }));
  }

  async function save() {
    const result = await send("PUT", `/settings/${sectionPath}`, values);
    if (result) setSavedValues(values);
  }

  return { values, hasChanged, savingState, errorMessage, change, reset: () => setValues(savedValues), save };
}
