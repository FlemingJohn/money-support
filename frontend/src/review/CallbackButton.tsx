"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PhoneCall } from "lucide-react";
import { CallbackDialog } from "@/review/CallbackDialog";
import type { CallbackButtonProps } from "@/types/CallbackButtonProps";

export function CallbackButton({ callId, callerLabel, phone }: CallbackButtonProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  function close() {
    setIsOpen(false);
    router.refresh();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-control bg-yellow px-4 text-sm font-semibold text-ink hover:bg-yellow-deep"
      >
        <PhoneCall size={16} strokeWidth={2} aria-hidden="true" />
        Call back
      </button>
      {isOpen && <CallbackDialog callId={callId} callerLabel={callerLabel} phone={phone} onClose={close} />}
    </>
  );
}
