"use client";

import { useState } from "react";
import { EyeOff } from "lucide-react";

export function PrivacyModeButton() {
  const [isPrivate, setIsPrivate] = useState(false);
  const background = isPrivate ? "bg-yellow-soft" : "bg-paper";

  return (
    <button
      type="button"
      onClick={() => setIsPrivate(!isPrivate)}
      aria-pressed={isPrivate}
      aria-label="Privacy mode"
      title="Privacy mode"
      className={`grid size-11 place-items-center rounded-control border border-line text-ink ${background}`}
    >
      <EyeOff size={20} strokeWidth={1.75} aria-hidden="true" />
    </button>
  );
}
