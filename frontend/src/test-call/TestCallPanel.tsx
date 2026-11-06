"use client";

import { Info, ListChecks, MessageSquare, Phone } from "lucide-react";
import { SectionCard } from "@/components/SectionCard";
import { useTestCall } from "@/hooks/useTestCall";
import { AgentFactList } from "@/test-call/AgentFactList";
import { CallControls } from "@/test-call/CallControls";
import { LiveTranscript } from "@/test-call/LiveTranscript";
import { TestScenarioList } from "@/test-call/TestScenarioList";
import type { TestCallPanelProps } from "@/types/TestCallPanelProps";

export function TestCallPanel({ setup, agent, faqQuestions }: TestCallPanelProps) {
  const testCall = useTestCall(setup);

  return (
    <div className="flex flex-1 flex-wrap items-stretch gap-4">
      <div className="flex min-w-0 flex-[1_1_320px] flex-col gap-4">
        <SectionCard title="Call" icon={Phone}>
          <CallControls testCall={testCall} />
        </SectionCard>
        <SectionCard title="Try saying" icon={ListChecks}>
          <TestScenarioList faqQuestions={faqQuestions} />
        </SectionCard>
        <SectionCard title="Agent" icon={Info}>
          <AgentFactList agent={agent} />
        </SectionCard>
      </div>
      <SectionCard title="Live transcript" icon={MessageSquare} className="flex-[2_1_520px]">
        <LiveTranscript lines={testCall.lines} />
      </SectionCard>
    </div>
  );
}
