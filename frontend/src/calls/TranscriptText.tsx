import { ShieldCheck } from "lucide-react";
import { splitTranscriptText } from "@/calls/splitTranscriptText";
import type { TranscriptTextProps } from "@/types/TranscriptTextProps";

export function TranscriptText({ text, fields = [] }: TranscriptTextProps) {
  return (
    <>
      {splitTranscriptText(text, fields).map((part, index) => {
        if (part.kind === "field") {
          return (
            <mark key={index} className="rounded-sm bg-yellow-soft px-1 text-ink box-decoration-clone">
              {part.text}
              <sup className="ml-0.5 font-mono text-[10px] font-bold">{part.fieldNumber}</sup>
            </mark>
          );
        }
        if (part.kind === "removed") {
          return (
            <span key={index} className="inline-flex items-center gap-1 whitespace-nowrap rounded-sm bg-redacted-wash px-2 text-[13px] font-semibold text-redacted-ink">
              <ShieldCheck size={12} strokeWidth={2.2} aria-hidden="true" />
              {part.text}
            </span>
          );
        }
        return <span key={index}>{part.text}</span>;
      })}
    </>
  );
}
