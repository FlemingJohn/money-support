import Link from "next/link";
import { ListChecks, MessageSquare } from "lucide-react";
import { ExtractedFieldList } from "@/calls/ExtractedFieldList";
import { TranscriptLine } from "@/calls/TranscriptLine";
import { EmptyState } from "@/components/EmptyState";
import { SectionCard } from "@/components/SectionCard";
import { ConfirmFieldsButton } from "@/review/ConfirmFieldsButton";
import { RemovedDataNotice } from "@/review/RemovedDataNotice";
import { ReviewActionsCard } from "@/review/ReviewActionsCard";
import { ReviewHeader } from "@/review/ReviewHeader";
import type { ReviewWorkspaceProps } from "@/types/ReviewWorkspaceProps";

export function ReviewWorkspace({ detail, callbacks, phone }: ReviewWorkspaceProps) {
  const { review, call } = detail;
  const removedTypes = [...new Set(call.guardrailEvents.filter((event) => event.kind === "personalDataRemoved").map((event) => event.entityType))];
  const isEveryFieldConfirmed = call.extractedFields.every((field) => field.isConfirmed);

  return (
    <div className="flex min-w-0 flex-[2_1_560px] flex-col gap-4">
      <ReviewHeader detail={detail} phone={phone} />

      <RemovedDataNotice removedTypes={removedTypes} />

      <div className="flex flex-wrap items-stretch gap-4">
        <SectionCard title="Extracted fields" icon={ListChecks} className="flex-[1_1_300px]" action={<ConfirmFieldsButton callId={call.id} isEveryFieldConfirmed={isEveryFieldConfirmed} />}>
          <ExtractedFieldList fields={call.extractedFields} />
        </SectionCard>

        <SectionCard title="Transcript · redacted" icon={MessageSquare} className="flex-[1_1_340px]" action={<Link href={`/calls/${call.id}`} className="inline-flex min-h-11 items-center text-sm font-semibold text-ink hover:underline">Full call</Link>}>
          {call.messages.length === 0 ? (
            <EmptyState message="This call has no transcript." />
          ) : (
            <ol className="flex max-h-120 flex-col gap-3 overflow-y-auto p-4">
              {call.messages.map((message) => (
                <TranscriptLine key={message.id} callId={call.id} message={message} fields={call.extractedFields.filter((field) => field.messageId === message.id)} />
              ))}
            </ol>
          )}
        </SectionCard>
      </div>

      <ReviewActionsCard review={review} callbacks={callbacks} agentReplies={call.messages.filter((message) => message.speaker === "agent")} />
    </div>
  );
}
