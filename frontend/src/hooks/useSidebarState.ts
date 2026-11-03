"use client";

import { useCallback, useSyncExternalStore } from "react";

const storageKey = "money-support:sidebar-collapsed";
const listeners = new Set<() => void>();

export function useSidebarState() {
  const isCollapsed = useSyncExternalStore(subscribe, readStoredValue, getServerValue);

  const toggleCollapsed = useCallback(() => {
    writeStoredValue(!readStoredValue());
    listeners.forEach((listener) => listener());
  }, []);

  return { isCollapsed, toggleCollapsed };
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function readStoredValue() {
  try {
    return window.localStorage.getItem(storageKey) === "true";
  } catch {
    return false;
  }
}

function getServerValue() {
  return false;
}

function writeStoredValue(value: boolean) {
  try {
    window.localStorage.setItem(storageKey, String(value));
  } catch {
    return;
  }
}
