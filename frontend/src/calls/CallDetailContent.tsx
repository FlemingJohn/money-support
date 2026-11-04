import Link from "next/link";
import { BookOpen, Info, ListChecks, MessageSquare, ShieldCheck, TextQuote } from "lucide-react";
import { CallDetailHeader } from "@/calls/CallDetailHeader";
import { CallFactList } from "@/calls/CallFactList";
import { ExtractedFieldList } from "@/calls/ExtractedFieldList";
import { getCallDetail } from "@/calls/getCallDetail";
import { GuardrailEventList } from "@/calls/GuardrailEventList";
import { TranscriptLine } from "@/calls/TranscriptLine";
import { EmptyState } from "@/components/EmptyState";
import { SectionCard } from "@/components/SectionCard";
import type { CallIdParamsProps } from "@/types/CallIdParamsProps";

export async function CallDetailContent({ params }: CallIdParamsProps) {
  const { callId } = await params;
  const call = await getCallDetail(callId);

  return (
    <>
      <CallDetailHeader call={call} />

      <div className="flex flex-1 flex-wrap items-stretch gap-4">
        <SectionCard title="Transcript · redacted" icon={MessageSquare} className="flex-[2_1_560px]">
          {call.messages.length === 0 ? (
            <EmptyState message="This call has no transcript. It may have been removed by the retention setting." />
          ) : (
            <ol className="flex flex-col gap-3 p-5">
              {call.messages.map((message) => (
                <TranscriptLine
                  key={message.id}
                  callId={call.id}
                  message={message}
                  fields={call.extractedFields.filter((field) => field.messageId === message.id)}
                />
              ))}
            </ol>
          )}
        </SectionCard>

        <div className="flex min-w-0 flex-[1_1_320px] flex-col gap-4">
          <SectionCard title="Summary" icon={TextQuote}>
            {call.summary ? <p className="px-5 py-4 text-sm leading-relaxed">{call.summary}</p> : <EmptyState message="No summary for this call." />}
          </SectionCard>

          <SectionCard title="Matched FAQ" icon={BookOpen}>
            {call.matchedFaq ? (
              <Link href="/faqs" className="flex items-center gap-2.5 px-5 py-4 text-sm font-semibold text-ink hover:bg-surface">
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-yellow font-mono text-xs">{call.matchedFaq.number}</span>
                <span className="min-w-0">{call.matchedFaq.question}</span>
              </Link>
            ) : (
              <EmptyState message="The agent did not answer from an FAQ." />
            )}
          </SectionCard>

          <SectionCard title="Extracted fields" icon={ListChecks}>
            <ExtractedFieldList fields={call.extractedFields} />
          </SectionCard>

          <SectionCard title="Guardrails" icon={ShieldCheck}>
            <GuardrailEventList events={call.guardrailEvents} />
          </SectionCard>

          <SectionCard title="Call details" icon={Info} className="flex-1">
            <CallFactList call={call} />
          </SectionCard>
        </div>
      </div>
    </>
  );
}
